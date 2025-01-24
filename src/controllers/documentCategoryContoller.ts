import documentCategoryService from '../services/documentCategoryService';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

// Create a new document category
const create = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  const newCategory = await documentCategoryService.create(payload);
  res.status(201).json({
    success: true,
    message: 'Document Category created successfully',
    data: newCategory,
  });
});

// Get all document categories
const findAll = catchAsync(async (req: Request, res: Response) => {
  const categories = await documentCategoryService.findAll();
  res.status(200).json({
    success: true,
    message: 'Document Categories fetched successfully',
    data: categories,
  });
});

// Get a document category by ID
const findById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await documentCategoryService.findById(id);
  res.status(200).json({
    success: true,
    message: 'Document Category fetched successfully',
    data: category,
  });
});

// Update a document category by ID
const updateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = { ...req.body };
  const updatedCategory = await documentCategoryService.updateById(id, payload);
  res.status(200).json({
    success: true,
    message: 'Document Category updated successfully',
    data: updatedCategory,
  });
});

// Delete a document category by ID
const deleteById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await documentCategoryService.deleteById(id);
  res.status(200).json({
    success: true,
    message: 'Document Category deleted successfully',
  });
});

export default {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};
