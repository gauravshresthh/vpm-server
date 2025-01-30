import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const getAllUsersValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional().default(''),
}).options({ allowUnknown: false });

const getUserByIdValidationSchema = Joi.object({
  user_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'user_id must be a string',
    'string.pattern.base': 'user_id must be a valid MongoDB ObjectId',
    'any.required': 'user_id is required',
  }),
}).options({ allowUnknown: false });

const updateUserByIdValidationSchema = Joi.object({
  user_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'user_id must be a string',
    'string.pattern.base': 'user_id must be a valid MongoDB ObjectId',
    'any.required': 'user_id is required',
  }),
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string',
  }),
  email: Joi.string().email().optional().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
  }),
  photo: Joi.string().optional().messages({
    'string.base': 'photo must be a string',
  }),
  phone_number: Joi.string().optional().messages({
    'string.base': 'phone_number must be a string',
  }),
  roles: Joi.array()
    .items(Joi.string().pattern(objectIdRegex))
    .optional()
    .messages({
      'array.base': 'Roles must be an array of ObjectIds',
      'array.includes': 'Each role must be a valid MongoDB ObjectId',
    }),
  active: Joi.boolean().optional().messages({
    'boolean.base': 'active must be a boolean',
  }),
}).options({ allowUnknown: false });

const deleteMultipleUserByIdsSchema = Joi.object({
  user_ids: Joi.array()
    .items(Joi.string().pattern(objectIdRegex).required())
    .min(1)
    .required()
    .messages({
      'array.base': 'user_ids must be an array',
      'string.pattern.base': 'Each user_id must be a valid MongoDB ObjectId',
      'any.required': 'user_ids are required',
      'array.min': 'At least one user_id must be provided',
    }),
}).options({ allowUnknown: false });

const getAnalyticsSchema = Joi.object({}).options({ allowUnknown: false });

export {
  getAllUsersValidationSchema,
  getUserByIdValidationSchema,
  updateUserByIdValidationSchema,
  deleteMultipleUserByIdsSchema,
  getAnalyticsSchema,
};
