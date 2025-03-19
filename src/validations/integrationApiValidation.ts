import Joi from 'joi';

const integrationApiForStudentValidationSchema = Joi.object({
  first_name: Joi.string().required().messages({
    'string.base': 'first_name must be a string',
    'any.required': 'first_name is required',
  }),
  last_name: Joi.string().required().messages({
    'string.base': 'last_name must be a string',
    'any.required': 'last_name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  dob: Joi.string().required().messages({
    'string.base': 'dob must be a string',
    'any.required': 'dob is required',
  }),
  courses: Joi.array()
    .items(
      Joi.object({
        course_name: Joi.string().required().messages({
          'string.base': 'course_name must be a string',
          'any.required': 'course_name is required',
        }),
        course_code: Joi.string().required().messages({
          'string.base': 'course_code must be a string',
          'any.required': 'course_code is required',
        }),
      })
    )
    .required()
    .messages({
      'array.base': 'courses must be an array of objects',
      'any.required': 'courses is required',
    }),
}).options({ allowUnknown: false });

export { integrationApiForStudentValidationSchema };
