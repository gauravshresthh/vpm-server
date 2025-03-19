import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import integrationService from '../services/integrationService';
import CustomError from '../utils/CustomError';

const integrateStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.INTEGRATION_API_KEY) {
      return next(new CustomError('Unauthorized access.', 401));
    }
    const payload = req.body;
    const result = await integrationService.integrateStudent(payload);

    res.status(200).json({
      success: true,
      message: 'Student integration success.',
      data: result,
    });
  }
);

export default {
  integrateStudent,
};
