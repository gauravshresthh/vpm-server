/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import catchAsync from '../utils/catchAsync';
import userService from '../service/userService';
import sendEmail from '../utils/sendEmail';
import { RegistrationEmail } from '../emails/RegistrationTemplates';
import crypto from 'crypto';
import { ResendRegistrationOtpEmail } from '../emails/ResendRegistrationOtpEmail';
import factory from '../utils/handleFactory';
import CustomError from '../utils/CustomError';

const register = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message:
          'This email address is already associated with another account.',
      });
      return;
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    req.body.role = 'student';
    req.body.otp = otp;
    req.body.otp_expiry = otpExpiry;
    await userService.create(req.body);

    await sendEmail({
      email,
      subject: 'Vocational Placement Management Registration',
      message: 'You registered to VPM successfully.',
      htmlContent: RegistrationEmail(
        `${process.env.API_URL}/registration/${email}`,
        otp
      ),
    });
    res
      .status(201)
      .json({ success: true, message: 'User registered successfully' });
  }
);

const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  if (!user.is_verified) {
    res.status(403).json({
      success: false,
      message:
        'Email not verified. Please verify your email before logging in.',
    });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
    return;
  }

  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: '90d',
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const verifyOtp = catchAsync(
  async (req: Request, res: Response): Promise<any> => {
    const { email, otp } = req.body;

    const user: any = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    if (user.otp_expiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please apply a new one.',
      });
    }

    user.is_verified = true;
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: 'User verified successfully.' });
  }
);

const resendOtp = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (user.is_verified) {
      res
        .status(400)
        .json({ success: false, message: 'User is already verified.' });
      return;
    }

    const now = new Date();
    if (
      user.last_otp_sent_at &&
      now.getTime() - user.last_otp_sent_at.getTime() < 60 * 1000
    ) {
      res.status(429).json({
        success: false,
        message: 'Please wait at least 1 minute before requesting a new OTP.',
      });
      return;
    }

    const newOtp = crypto.randomInt(100000, 999999).toString();
    const newOtpExpiry = new Date(now.getTime() + 10 * 60 * 1000);

    user.otp = newOtp;
    user.otp_expiry = newOtpExpiry;
    user.last_otp_sent_at = now;
    await user.save();

    await sendEmail({
      email,
      subject: 'Vocational Placement Management - OTP Resend',
      message: `Your new OTP is ${newOtp}. It is valid for 10 minutes.`,
      htmlContent: ResendRegistrationOtpEmail(
        `${process.env.API_URL}/registration/${email}`,
        newOtp
      ),
    });

    res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email.',
    });
  }
);

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user;
  req.params.id = user.id;
  next();
};

const updateMe = catchAsync(async (req, res, next) => {
  const user: any = req.user;
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new CustomError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filterObj = (
    obj: any,
    ...allowedFields: string[]
  ): Record<string, any> => {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

  const filteredBody = filterObj(req.body, 'name', 'photo');

  const result = await User.findByIdAndUpdate(user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      user: result,
    },
  });
});

const getUser = factory.getOne(User);

export default {
  register,
  login,
  verifyOtp,
  resendOtp,
  getMe,
  getUser,
  updateMe,
};
