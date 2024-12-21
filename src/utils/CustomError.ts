class CustomError extends Error {
  statusCode: number;
  success: boolean;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);

    // Directly use the default value of 400 if statusCode is not provided
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
