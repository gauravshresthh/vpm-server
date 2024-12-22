import Joi from 'joi';

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
  role: Joi.string()
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
      'string.base': 'Role must be a string',
      'any.required': 'Role is required',
      'any.only':
        'Role must be one of the following: system-admin, college-admin, vpo, vp-provider, facilitator, trainer, student',
    }),
}).options({ allowUnknown: false });

export { createUserValidationSchema };
