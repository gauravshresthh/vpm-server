import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import providerService from '../services/providerService';

const create = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  const result = await providerService.create(payload);

  res.status(201).json({
    success: true,
    message: 'Provider created successfully',
    data: result,
  });
});

const findAll = catchAsync(async (req: Request, res: Response) => {
  const result = await providerService.findAll();

  res.status(201).json({
    success: true,
    message: 'Provider fetched successfully',
    data: result,
  });
});

export default {
  create,
  findAll,
};
