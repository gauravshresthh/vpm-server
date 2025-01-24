import Joi from 'joi';

export const createDocumentCategoryValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().optional(),
});

export const updateDocumentCategoryValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  description: Joi.string().optional(),
});
