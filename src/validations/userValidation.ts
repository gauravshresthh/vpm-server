import Joi from 'joi';

const userLoginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ allowUnknown: false });

const userRegisterValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ allowUnknown: false });

export { userLoginValidationSchema, userRegisterValidationSchema };
