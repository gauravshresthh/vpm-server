/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import userService from '../services/userService';
import crypto from 'crypto';
import { ResendRegistrationOtpEmailTemplate } from '../emails/ResendRegistrationOtpEmailTemplate';
import factory from '../utils/handleFactory';
import CustomError from '../utils/CustomError';
import emailService from '../services/emailService';
import generateAccessToken from '../utils/generateAccessToken';
import mongoose from 'mongoose';

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    const userExists = await userService.findUserByEmail(email);

    if (userExists) {
      return next(
        new CustomError(
          'This email address is already associated with another account.',
          400
        )
      );
    }
    const result = await userService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || '';

    const user: any = await userService.findUserByEmail(email);
    if (!user) {
      return next(new CustomError('User not found.', 401));
    }

    if (!user.is_verified) {
      return next(
        new CustomError(
          'Email not verified. Please verify your email before logging in.',
          403
        )
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new CustomError('Invalid credentials', 401));
    }

    const token = generateAccessToken(user._id, user.role);

    const result = {
      id: user._id,
      email: user.email,
      role: user.role.name,
      name: user.name,
    };

    await trackLoginDetails(user._id, ip, userAgent);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: result,
      },
    });
  }
);

const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, otp } = req.body;

    const user: any = await userService.findUserByEmail(email);
    if (!user) {
      return next(new CustomError('User not found.', 401));
    }

    if (user.otp !== otp) {
      return next(new CustomError('Invalid OTP.', 400));
    }

    if (user.otp_expiry < new Date()) {
      return next(
        new CustomError('OTP has expired. Please apply a new one.', 400)
      );
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    const user: any = await userService.findUserByEmail(email);
    if (!user) {
      return next(new CustomError('User not found.', 401));
    }

    if (user.is_verified) {
      return next(new CustomError('User is already verified.', 400));
    }

    const now = new Date();
    if (
      user.last_otp_sent_at &&
      now.getTime() - user.last_otp_sent_at.getTime() < 60 * 1000
    ) {
      return next(
        new CustomError(
          'Please wait at least 1 minute before requesting a new OTP.',
          429
        )
      );
    }

    const newOtp = crypto.randomInt(100000, 999999).toString();
    const newOtpExpiry = new Date(now.getTime() + 10 * 60 * 1000);

    user.otp = newOtp;
    user.otp_expiry = newOtpExpiry;
    user.last_otp_sent_at = now;
    await user.save();

    const emailPayload = {
      email,
      subject: 'Vocational Placement Management - OTP Resend',
      message: `Your new OTP is ${newOtp}. It is valid for 10 minutes.`,
      htmlContent: ResendRegistrationOtpEmailTemplate(
        `${process.env.API_URL}/registration/${email}`,
        newOtp
      ),
    };

    await emailService.sendEmail(emailPayload);

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

const trackLoginDetails = async (
  userId: mongoose.Types.ObjectId,
  ip: string,
  userAgent: string
) => {
  await User.findByIdAndUpdate(
    userId,
    {
      login_at: new Date(),
      ip_address: ip,
      user_agent: userAgent,
    },
    { new: true }
  );
};

export default {
  register,
  login,
  verifyOtp,
  resendOtp,
  getMe,
  getUser,
  updateMe,
};
