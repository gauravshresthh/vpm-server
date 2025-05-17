/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import documentService from '../services/documentService';
import CustomError from '../utils/CustomError';
import { User } from '../models/userModel';

export const hasDocumentAccess = async (req: Request, documentId: string) => {
  const userFromRequest = req.user as { id: string };
  const user: any = await User.findById(userFromRequest.id).populate('role');
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const allowedRoles = ['system-admin'];
  const userRole = (user.role as any)?.name;
  const hasAccess = allowedRoles.includes(userRole);
  if (!hasAccess) {
    throw new CustomError('Forbidden: You do not have access', 403);
  }
  const document = await documentService.findById(documentId);
  if (!document) {
    throw new CustomError('Document not found', 404);
  }

  const isUploadedByUser =
    user._id.toString() === document.uploaded_by.toString();

  return isUploadedByUser || hasAccess;
};

const create = catchAsync(async (req: Request, res: Response) => {
  // const user = req.body
  const user: any = req.user;
  const payload = { ...req.body, uploaded_by: user?._id };

  const result = await documentService.create(payload);

  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: result,
  });
});

const createMany = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    const documents = req.body.documents;
    if (!Array.isArray(documents)) {
      return next(
        new CustomError('Invalid input, documents should be an array', 403)
      );
    }
    const payload = documents.map((doc) => ({
      ...doc,
      uploaded_by: user?._id,
    }));

    const result = await documentService.createMany(payload);

    res.status(201).json({
      success: true,
      message: 'Documents created successfully',
      data: result,
    });
  }
);

const findAll = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const category_id =
    typeof req.query.category_id === 'string' ? req.query.category_id : '';
  const result = await documentService.findAll(
    page,
    limit,
    search,
    category_id
  );

  res.status(200).json({
    success: true,
    message: 'Documents fetched successfully',
    data: result,
  });
});

const findMyDocuments = catchAsync(async (req: Request, res: Response) => {
  const userFromRequest = req.user as { id: string };
  const result = await documentService.findMyDocuments(userFromRequest.id);

  res.status(200).json({
    success: true,
    message: 'Documents fetched successfully',
    data: result,
  });
});

const findById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const hasAccess = await hasDocumentAccess(req, id);
    if (!hasAccess) {
      return next(new CustomError('Denied: Permission error', 403));
    }
    const result = await documentService.findById(id);

    res.status(200).json({
      success: true,
      message: 'Document fetched successfully',
      data: result,
    });
  }
);

const findByParentId = catchAsync(async (req: Request, res: Response) => {
  const { parentId } = req.query; // Assuming parentId is passed as a query parameter

  const result = await documentService.findByParentId(parentId as string);

  res.status(200).json({
    success: true,
    message: 'Documents fetched by parent ID successfully',
    data: result,
  });
});

const updateById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = { ...req.body };

    const hasAccess = await hasDocumentAccess(req, id);
    if (!hasAccess) {
      return next(new CustomError('Denied: Permission error', 403));
    }
    const result = await documentService.updateById(id, payload);

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: result,
    });
  }
);

const changeDocumentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const payload = { ...req.body };
    const hasAccess = await hasDocumentAccess(req, id);
    if (!hasAccess) {
      return next(new CustomError('Denied: Permission error', 403));
    }
    const result = await documentService.changeDocumentStatus(id, payload);

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: result,
    });
  }
);

const deleteById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const hasAccess = await hasDocumentAccess(req, id);
    if (!hasAccess) {
      return next(new CustomError('Denied: Permission error', 403));
    }

    await documentService.deleteById(id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  }
);

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
  findMyDocuments,
  createMany,
  changeDocumentStatus,
};
