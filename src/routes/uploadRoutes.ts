import { Router, Request, Response } from 'express';
import upload from '../middlewares/uploadMiddleware';
import catchAsync from '../utils/catchAsync';
import CustomError from '../utils/CustomError';
import { authenticate } from '../middlewares/authenticate';
import path from 'path';

const router = Router();

// File upload endpoint
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  catchAsync((req: Request, res: Response) => {
    if (!req.file) {
      throw new CustomError('No file uploaded.', 400);
    }
    const fileType = path.extname(req.file.originalname).slice(1);
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        url: fileUrl,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        fileType,
      },
    });
  })
);

// Multiple file upload endpoint
router.post(
  '/upload-multiple',
  authenticate,
  upload.array('files', 10), // Accepts up to 10 files
  catchAsync((req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new CustomError('No files uploaded.', 400);
    }

    const files = (req.files as Express.Multer.File[]).map((file) => {
      const fileType = path.extname(file.originalname).slice(1);
      return {
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        originalName: file.originalname,
        fileName: file.filename,
        fileType,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully.',
      data: { files },
    });
  })
);

export default router;
