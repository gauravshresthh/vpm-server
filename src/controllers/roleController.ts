import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import roleService from '../services/roleService';

// const create = catchAsync(async (req: Request, res: Response) => {
//   const payload = { ...req.body };

//   const result = await roleService.create(payload);

//   res.status(201).json({
//     success: true,
//     message: 'Provider created successfully',
//     data: result,
//   });
// });

const findAll = catchAsync(async (req: Request, res: Response) => {
  const result = await roleService.findAll();

  res.status(201).json({
    success: true,
    message: 'Roles fetched successfully',
    data: result,
  });
});

export default {
  // create,
  findAll,
};
