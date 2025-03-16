/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const sanitize = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = { ...req.body, ...req.query, ...req.params };
      const validated = await schema.validateAsync(payload, {
        stripUnknown: true,
      });
      req.body = validated;
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.details.map((err: Joi.ValidationErrorItem) => ({
          field: err.context?.key,
          message: err.message,
        })),
      });
      return;
    }
  };
};

export default sanitize;
