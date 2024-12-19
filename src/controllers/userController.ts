import { Request, Response } from 'express';
import { User } from '../models/userModel';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import catchAsync from '../utils/catchAsync';
import userService from '../service/userService';

const register = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        status: 'fail',
        message:
          'This email address is already associated with another account.',
      });
      return;
    }
    req.body.role = 'student';
    await userService.create(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  }
);

const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
});

export default {
  register,
  login,
};
