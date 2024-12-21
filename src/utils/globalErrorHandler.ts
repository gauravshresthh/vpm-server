/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import CustomError from './CustomError';

const handleCastErrorDB = (err: any): CustomError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): CustomError => {
  const match = err.errmsg?.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : 'unknown value';

  const message = `Duplicate field value: ${value}. Please try using another value!`;
  return new CustomError(message, 400);
};

const handleValidationErrorDB = (err: any): CustomError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid data: ${errors.join('. ')}`;
  return new CustomError(message, 400);
};

const handleJWTError = (): CustomError =>
  new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): CustomError =>
  new CustomError('Your token has expired! Please log in again.', 401);

const handleMulterError = (): CustomError =>
  new CustomError(
    'Please provide a valid file with field name as "photo".',
    400
  );

const sendErrorDev = (err: any, res: Response): void => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response): void => {
  if (err.isOperational) {
    // Trusted operational error
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Programming or unknown error
    console.error('ERROR 💥:', err);

    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error caught by global handler:', err);
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational || false;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'MulterError') error = handleMulterError();
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
