import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import providerService from '../services/providerService';
import mongoose from 'mongoose';

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const result = await providerService.findAll(page, limit, search);

  res.status(200).json({
    success: true,
    message: 'Providers fetched successfully',
    data: result,
  });
});

const findById = catchAsync(async (req: Request, res: Response) => {
  const { provider_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(provider_id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid provider_id',
    });
    return;
  }

  const result = await providerService.findById(provider_id);

  res.status(200).json({
    success: true,
    message: 'Provider fetched successfully',
    data: result,
  });
});

const updateById = catchAsync(async (req: Request, res: Response) => {
  const { provider_id } = req.params;
  const payload = { ...req.body };

  if (!mongoose.Types.ObjectId.isValid(provider_id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid provider_id',
    });
    return;
  }
  const result = await providerService.updateById(provider_id, payload);

  res.status(200).json({
    success: true,
    message: 'Provider updated successfully',
    data: result,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const { provider_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(provider_id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid provider_id',
    });
    return;
  }
  await providerService.deleteById(provider_id);

  res.status(200).json({
    success: true,
    message: 'Provider deleted successfully',
    data: null,
  });
});

export default {
  create,
  findAll,
  updateById,
  findById,
  deleteById,
};
