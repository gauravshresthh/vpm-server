import { Router, Request, Response } from 'express';
import upload from '../middlewares/uploadMiddleware';
import catchAsync from '../utils/catchAsync';
import CustomError from '../utils/CustomError';
import { authenticate } from '../middlewares/authenticate';

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

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: { url: fileUrl },
    });
  })
);

export default router;
