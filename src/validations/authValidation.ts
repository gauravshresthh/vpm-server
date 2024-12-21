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

const verifyOtpValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
}).options({ allowUnknown: false });

const resendOtpValidationSchema = Joi.object({
  email: Joi.string().email().required(),
}).options({ allowUnknown: false });

const updateMeValidationSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
}).options({ allowUnknown: false });

export {
  userLoginValidationSchema,
  userRegisterValidationSchema,
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
  updateMeValidationSchema,
};
