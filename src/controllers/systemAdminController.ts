/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import userService from '../services/userService';
import CustomError from '../utils/CustomError';
import { User } from '../models/userModel';
import emailService from '../services/emailService';
import { PasswordResetEmailTemplate } from '../emails/PasswordResetEmailTemplate';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, name, password, role } = req.body;

  const payload = { email, name, password, role };

  const result = await userService.create(payload);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const resetUserPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure this route is protected with system admin authorization middleware

    const { user_id, new_password, notify_with_email } = req.body;

    // 1. Validate inputs
    if (!user_id || !new_password) {
      return next(
        new CustomError('User ID and new password are required.', 400)
      );
    }

    // 2. Find the user
    const user = await User.findById(user_id).select('+password'); // or however you get the password field

    if (!user) {
      return next(new CustomError('User not found.', 404));
    }

    // 3. Update password
    user.password = new_password;

    // 4. Save user with new password (will hash if using pre-save hooks)
    await user.save();
    const email = user.email;

    if (email && notify_with_email) {
      const loginLink = `${process.env.FRONTEND_URL}/auth/sign-in`;
      const payload = {
        email,
        password: new_password,
      };
      const emailPayload = {
        email,
        subject: 'Your password has been reset on VPMS',
        message: 'Your password has been reset on VPMS',
        htmlContent: PasswordResetEmailTemplate(loginLink, payload),
      };

      await emailService.sendEmail(emailPayload);
    }

    res.status(200).json({
      success: true,
      message: `Password for user ${user_id} has been reset successfully.`,
    });
  }
);

const editUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    const updateData = req.body;

    const allowedFields = ['name', 'phone_number', 'active'];
    const filteredData: Record<string, any> = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredData[key] =
          typeof updateData[key] === 'string'
            ? updateData[key].trim()
            : updateData[key];
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return next(new CustomError('No valid fields provided for update.', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(user_id, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(new CustomError('User not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  }
);

const editUserRoleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;
    const { role_id } = req.body;

    const payload = { role: role_id };
    const updatedUser = await User.findByIdAndUpdate(user_id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(new CustomError('User not found.', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  }
);

const deleteUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.user_id;

  // Check if userId is provided
  if (!userId) {
    return next(new CustomError('User ID is required.', 400));
  }

  // Find user by ID and delete
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return next(new CustomError('User not found.', 404));
  }

  res.status(200).json({
    success: true,
    message: `User with ID ${userId} has been deleted successfully.`,
  });
});

export default {
  createUser,
  resetUserPassword,
  editUserById,
  editUserRoleById,
  deleteUserById
};
