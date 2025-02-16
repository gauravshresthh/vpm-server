import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const invitationValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  role: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'Role must be a string',
    'string.pattern.base': 'Role must be a valid MongoDB ObjectId',
    'any.required': 'Role is required',
  }),
  message: Joi.string().optional().messages({
    'string.base': 'Message must be a string',
  }),
}).options({ allowUnknown: false });

const acceptInvitationValidationSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': 'Token be a string',
    'any.required': 'Token is required',
  }),
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
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

export { invitationValidationSchema, acceptInvitationValidationSchema };
