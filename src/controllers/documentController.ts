import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import documentService from '../services/documentService';

const create = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  const result = await documentService.create(payload);

  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: result,
  });
});

const findAll = catchAsync(async (req: Request, res: Response) => {
  const result = await documentService.findAll();

  res.status(200).json({
    success: true,
    message: 'Documents fetched successfully',
    data: result,
  });
});

const findById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await documentService.findById(id);

  res.status(200).json({
    success: true,
    message: 'Document fetched successfully',
    data: result,
  });
});

const findByParentId = catchAsync(async (req: Request, res: Response) => {
  const { parentId } = req.query; // Assuming parentId is passed as a query parameter

  const result = await documentService.findByParentId(parentId as string);

  res.status(200).json({
    success: true,
    message: 'Documents fetched by parent ID successfully',
    data: result,
  });
});

const updateById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = { ...req.body };

  const result = await documentService.updateById(id, payload);

  res.status(200).json({
    success: true,
    message: 'Document updated successfully',
    data: result,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await documentService.deleteById(id);

  res.status(200).json({
    success: true,
    message: 'Document deleted successfully',
  });
});

const addVersion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { version } = req.body;

  const result = await documentService.addVersion(id, version);

  res.status(200).json({
    success: true,
    message: 'Version added successfully',
    data: result,
  });
});

const removeVersion = catchAsync(async (req: Request, res: Response) => {
  const { id, versionId } = req.params;

  const result = await documentService.removeVersion(id, versionId);

  res.status(200).json({
    success: true,
    message: 'Version removed successfully',
    data: result,
  });
});

const setCurrentVersion = catchAsync(async (req: Request, res: Response) => {
  const { id, versionId } = req.params;

  const result = await documentService.setCurrentVersion(id, versionId);

  res.status(200).json({
    success: true,
    message: 'Current version set successfully',
    data: result,
  });
});

export default {
  create,
  findAll,
  findById,
  findByParentId,
  updateById,
  deleteById,
  addVersion,
  removeVersion,
  setCurrentVersion,
};
