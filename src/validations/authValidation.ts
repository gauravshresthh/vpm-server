import Joi from 'joi';

const userLoginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
}).options({ allowUnknown: false });

const userRegisterValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
      )
    )
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
}).options({ allowUnknown: false });

const verifyOtpValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  otp: Joi.string().required().messages({
    'string.base': 'OTP must be a string',
    'any.required': 'OTP is required',
  }),
}).options({ allowUnknown: false });

const resendOtpValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
}).options({ allowUnknown: false });

const updateMeValidationSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string',
  }),
  photo: Joi.string().optional().messages({
    'string.base': 'Photo must be a string',
  }),
  phone_number: Joi.string().optional().messages({
    'string.base': 'Phone number must be a string',
  }),
}).options({ allowUnknown: false });

const changeMyPasswordValidationSchema = Joi.object({
  old_password: Joi.string().trim().required().messages({
    'string.base': 'Old password must be a string',
    'any.required': 'Old password is required',
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
}).options({ allowUnknown: false });

export {
  userLoginValidationSchema,
  userRegisterValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
  updateMeValidationSchema,
  changeMyPasswordValidationSchema,
};
