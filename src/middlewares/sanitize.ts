import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const sanitize = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details.map((d) => d.message),
      });
    }
    next(); 
  };
};

export default sanitize;