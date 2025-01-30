import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import userService from '../services/userService';
import { UpdateUserType } from '../types/userTypes';

const findAll = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const result = await userService.findAll(page, limit, search);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: result,
  });
});

const findById = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.params.user_id;
  const result = await userService.findById(user_id);

  res.status(200).json({
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const updateById = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.params.user_id;
  const payload: UpdateUserType = req.body;
  const result = await userService.updateById(user_id, payload);

  res.status(200).json({
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

const deleteMultipleByIds = catchAsync(async (req: Request, res: Response) => {
  const { user_ids } = req.body;

  const result = await userService.deleteMultipleByIds(user_ids);

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} users deleted successfully`,
  });
});

const getUserAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUserAnalytics();

  res.status(200).json({
    success: true,
    message: 'User analytics fetched successfully',
    data: result,
  });
});

export default {
  findAll,
  findById,
  updateById,
  deleteMultipleByIds,
  getUserAnalytics,
};
