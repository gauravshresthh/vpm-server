import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import userService from '../services/userService';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, name, password, roles } = req.body;

  const payload = { email, name, password, roles };

  const result = await userService.create(payload);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export default {
  createUser,
};
