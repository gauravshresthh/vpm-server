import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addressSchema = Joi.object({
  street_line1: Joi.string().required().messages({
    'string.base': 'Street Line 1 must be a string',
    'any.required': 'Street Line 1 is required',
  }),
  street_line2: Joi.string().optional().messages({
    'string.base': 'Street Line 2 must be a string',
  }),
  city: Joi.string().required().messages({
    'string.base': 'City must be a string',
    'any.required': 'City is required',
  }),
  state: Joi.string().required().messages({
    'string.base': 'State must be a string',
    'any.required': 'State is required',
  }),
  postal_code: Joi.string().required().messages({
    'string.base': 'Postal Code must be a string',
    'any.required': 'Postal Code is required',
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country must be a string',
    'any.required': 'Country is required',
  }),
});

const contactPersonSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Contact Person Name must be a string',
    'any.required': 'Contact Person Name is required',
  }),
  title: Joi.string().optional().messages({
    'string.base': 'Contact Person Title must be a string',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Contact Person Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Contact Person Email is required',
  }),
  phone: Joi.string().required().messages({
    'string.base': 'Contact Person Phone must be a string',
    'any.required': 'Contact Person Phone is required',
  }),
  fax: Joi.string().optional().messages({
    'string.base': 'Contact Person Fax must be a string',
  }),
});

const campusSchema = Joi.object({
  _id: Joi.string().pattern(objectIdRegex).optional().messages({
    'string.base': '_id must be a string',
    'string.pattern.base': '_id must be a valid MongoDB ObjectId',
  }),
  name: Joi.string().optional().messages({
    'any.required': 'Campus Name is required',
  }),
  address: addressSchema.optional(),
  created_at: Joi.string().optional(),
  updated_at: Joi.string().optional(),
});

const createProviderValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Provider Name must be a string',
    'any.required': 'Provider Name is required',
  }),
  legal_name: Joi.string().required().messages({
    'string.base': 'Legal Name must be a string',
    'any.required': 'Legal Name is required',
  }),
  website: Joi.string().uri().optional().messages({
    'string.base': 'Website must be a valid URL',
    'string.uri': 'Invalid URL format',
  }),
  training_organization_type: Joi.string().optional().messages({
    'string.base': 'Training Organization Type must be a string',
  }),
  rto_code: Joi.string().optional().messages({
    'string.base': 'RTO Code must be a string',
  }),
  is_public_rto: Joi.boolean().optional().messages({
    'boolean.base': 'Is Public RTO must be a boolean',
  }),
  cricos_code: Joi.string().optional().messages({
    'string.base': 'CRICOS Code must be a string',
  }),
  abn: Joi.string().optional().messages({
    'string.base': 'ABN must be a string',
  }),
  head_office_address: addressSchema.required().messages({
    'any.required': 'Head Office Address is required',
  }),
  postal_same_as_office: Joi.boolean().optional().messages({
    'boolean.base': 'Postal Same As Office must be a boolean',
  }),
  contact_person: contactPersonSchema.required().messages({
    'any.required': 'Contact Person is required',
  }),
  campuses: Joi.array().items(campusSchema).optional().messages({
    'array.base': 'Campuses must be an array of campus objects',
  }),
}).options({ allowUnknown: false });

const updateProviderValidationSchema = Joi.object({
  provider_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'provider_id must be a string',
    'string.pattern.base': 'provider_id must be a valid MongoDB ObjectId',
    'any.required': 'provider_id is required',
  }),
  name: Joi.string().optional().messages({
    'string.base': 'Provider Name must be a string',
  }),
  legal_name: Joi.string().optional().messages({
    'string.base': 'Legal Name must be a string',
  }),
  website: Joi.string().uri().optional().messages({
    'string.base': 'Website must be a valid URL',
    'string.uri': 'Invalid URL format',
  }),
  training_organization_type: Joi.string().optional().messages({
    'string.base': 'Training Organization Type must be a string',
  }),
  rto_code: Joi.string().optional().messages({
    'string.base': 'RTO Code must be a string',
  }),
  is_public_rto: Joi.boolean().optional().messages({
    'boolean.base': 'Is Public RTO must be a boolean',
  }),
  cricos_code: Joi.string().optional().messages({
    'string.base': 'CRICOS Code must be a string',
  }),
  abn: Joi.string().optional().messages({
    'string.base': 'ABN must be a string',
  }),
  head_office_address: addressSchema.optional().messages({
    'any.required': 'Head Office Address is required',
  }),
  postal_same_as_office: Joi.boolean().optional().messages({
    'boolean.base': 'Postal Same As Office must be a boolean',
  }),
  contact_person: contactPersonSchema.optional().messages({
    'any.required': 'Contact Person is required',
  }),
  campuses: Joi.array().items(campusSchema).optional().messages({
    'array.base': 'Campuses must be an array of campus objects',
  }),
  assigned_to: Joi.string()
    .pattern(objectIdRegex)
    .allow(null)
    .optional()
    .messages({
      'string.base': 'Assigned To must be a string',
      'string.pattern.base': 'Assigned To must be a valid MongoDB ObjectId',
    }),
  created_at: Joi.string().optional(),
  updated_at: Joi.string().optional(),
}).options({ allowUnknown: false });

const getAllProviderValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional().default(''),
}).options({ allowUnknown: false });

const getProviderByIdValidationSchema = Joi.object({
  provider_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'provider_id must be a string',
    'string.pattern.base': 'provider_id must be a valid MongoDB ObjectId',
    'any.required': 'provider_id is required',
  }),
}).options({ allowUnknown: false });

const deleteProviderByIdValidationSchema = Joi.object({
  provider_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'provider_id must be a string',
    'string.pattern.base': 'provider_id must be a valid MongoDB ObjectId',
    'any.required': 'provider_id is required',
  }),
}).options({ allowUnknown: false });

export {
  createProviderValidationSchema,
  getAllProviderValidationSchema,
  updateProviderValidationSchema,
  getProviderByIdValidationSchema,
  deleteProviderByIdValidationSchema,
};
