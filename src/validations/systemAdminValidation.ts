import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const createUserValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
  roles: Joi.string()
    .valid(
      'system-admin',
      'college-admin',
      'vpo',
      'vp-provider',
      'facilitator',
      'trainer',
      'student'
    )
    .required()
    .messages({
      'string.base': 'Role must be an array of strings',
      'any.required': 'Role is required',
      'any.only':
        'Role must be one of the following: system-admin, college-admin, vpo, vp-provider, facilitator, trainer, student',
    }),
}).options({ allowUnknown: false });

const resetPasswordValidationSchema = Joi.object({
  user_id: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
  }),
  new_password: Joi.string()
    .trim()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/)
    .required()
    .messages({
      'string.base': 'New password must be a string',
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base':
        'New password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required',
    }),
  notify_with_email: Joi.boolean().optional().messages({
    'boolean.base': 'Notify with email must be a boolean',
  }),
}).options({ allowUnknown: false });

const editUserByIdValidationSchema = Joi.object({
  user_id: Joi.string().required().pattern(objectIdRegex).messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
    'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
  }),
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string',
  }),
  active: Joi.boolean().optional().messages({
    'boolean.base': 'Active must be a boolean',
  }),
  phone_number: Joi.string().optional().allow('').messages({
    'string.base': 'Phone Number must be a string',
  }),
}).options({ allowUnknown: false });

const editUserRoleByIdValidationSchema = Joi.object({
  user_id: Joi.string().required().pattern(objectIdRegex).messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
    'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
  }),
  role_id: Joi.string().required().pattern(objectIdRegex).messages({
    'string.base': 'Role ID must be a string',
    'any.required': 'Role ID is required',
    'string.pattern.base': 'Role ID must be a valid MongoDB ObjectId',
  }),
}).options({ allowUnknown: false });

const deleteUserByIdValidationSchema = Joi.object({
  user_id: Joi.string().required().pattern(objectIdRegex).messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
    'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
  }),
}).options({ allowUnknown: false });

export {
  createUserValidationSchema,
  resetPasswordValidationSchema,
  editUserByIdValidationSchema,
  editUserRoleByIdValidationSchema,
  deleteUserByIdValidationSchema,
};
