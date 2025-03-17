import Joi from 'joi';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// Validation schema for document versions
const versionSchema = Joi.object({
  filename: Joi.string().required().messages({
    'string.base': 'Version Filename must be a string',
    'any.required': 'Version Filename is required',
  }),
  uploaded_by: Joi.string().required().messages({
    'string.base': 'Uploaded By must be a string',
    'any.required': 'Uploaded By is required',
  }),
  upload_date: Joi.date().optional().messages({
    'date.base': 'Upload Date must be a valid date',
  }),
  size: Joi.number().required().messages({
    'number.base': 'Size must be a number',
    'any.required': 'Size is required',
  }),
  is_current: Joi.boolean().default(false).optional().messages({
    'boolean.base': 'Is Current must be a boolean',
  }),
});

// Main validation schema for creating a document
const createDocumentValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  filename: Joi.string().required().messages({
    'string.base': 'Filename must be a string',
    'any.required': 'Filename is required',
  }),
  file_type: Joi.string()
    .valid('pdf', 'csv', 'doc', 'docx', 'image', 'other', 'png', 'jpeg', 'jpg')
    .optional()
    .messages({
      'string.base': 'File Type must be a string',
      'any.only': 'Invalid File Type',
    }),
  url: Joi.string().required().messages({
    'string.base': 'Url must be a string',
    'any.required': 'Url is required',
  }),
  status: Joi.string()
    .valid('pending', 'in-review', 're-submit', 'approved')
    .optional()
    .default('pending')
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Invalid status',
    }),
  parent_id: Joi.string().pattern(objectIdRegex).optional().messages({
    'string.base': 'parent_id must be a string',
    'string.pattern.base': 'parent_id must be a valid MongoDB ObjectId',
    'any.required': 'parent_id is required',
  }),
  category_id: Joi.string()
    .pattern(objectIdRegex)
    .optional()
    .allow(null)
    .messages({
      'string.base': 'category_id must be a string',
      'string.pattern.base': 'category_id must be a valid MongoDB ObjectId',
      'any.required': 'category_id is required',
    }),
  is_folder: Joi.boolean().default(false).optional().messages({
    'boolean.base': 'Is Folder must be a boolean',
  }),
  size: Joi.number().default(0).optional().messages({
    'number.base': 'Size must be a number',
  }),
  versions: Joi.array().items(versionSchema).optional().messages({
    'array.base': 'Versions must be an array of version objects',
  }),
  starred: Joi.boolean().default(false).optional().messages({
    'boolean.base': 'Starred must be a boolean',
  }),
  recent: Joi.boolean().default(false).optional().messages({
    'boolean.base': 'Recent must be a boolean',
  }),
  visibility: Joi.string()
    .valid('public', 'private')
    .default('private')
    .optional()
    .messages({
      'string.base': 'Visibility must be a string',
      'any.only': 'Invalid Visibility',
    }),
  is_archived: Joi.boolean().default(false).optional().messages({
    'boolean.base': 'is_archived must be a boolean',
  }),
}).options({ allowUnknown: false });

const createManyDocumentsValidationSchema = Joi.object({
  documents: Joi.array()
    .items(createDocumentValidationSchema)
    .min(1)
    .required()
    .messages({
      'array.base': 'Documents must be an array',
      'array.min': 'Documents array must contain at least one document',
      'any.required': 'Documents array is required',
    }),
}).options({ allowUnknown: false });

// Validation schema for updating a document
const updateDocumentValidationSchema = Joi.object({
  id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'id must be a string',
    'string.pattern.base': 'id must be a valid MongoDB ObjectId',
    'any.required': 'id is required',
  }),
  name: Joi.string().optional().messages({
    'string.base': 'Name must be a string',
  }),
  filename: Joi.string().optional().messages({
    'string.base': 'Filename must be a string',
  }),
  file_type: Joi.string()
    .valid('pdf', 'csv', 'doc', 'docx', 'image', 'other')
    .optional()
    .messages({
      'string.base': 'File Type must be a string',
      'any.only': 'Invalid File Type',
    }),
  status: Joi.string()
    .valid('pending', 'in-review', 're-submit', 'approved')
    .optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Invalid status',
    }),
  url: Joi.optional().optional().messages({
    'string.base': 'Url must be a string',
  }),
  parent_id: Joi.string().pattern(objectIdRegex).optional().messages({
    'string.base': 'parent_id must be a string',
    'string.pattern.base': 'parent_id must be a valid MongoDB ObjectId',
    'any.required': 'parent_id is required',
  }),
  category: Joi.string().pattern(objectIdRegex).optional().messages({
    'string.base': 'category must be a string',
    'string.pattern.base': 'category must be a valid MongoDB ObjectId',
    'any.required': 'category is required',
  }),
  is_folder: Joi.boolean().optional().messages({
    'boolean.base': 'Is Folder must be a boolean',
  }),
  size: Joi.number().optional().messages({
    'number.base': 'Size must be a number',
  }),
  versions: Joi.array().items(versionSchema).optional().messages({
    'array.base': 'Versions must be an array of version objects',
  }),
  starred: Joi.boolean().optional().messages({
    'boolean.base': 'Starred must be a boolean',
  }),
  recent: Joi.boolean().optional().messages({
    'boolean.base': 'Recent must be a boolean',
  }),
  visibility: Joi.string().valid('public', 'private').optional().messages({
    'string.base': 'Visibility must be a string',
    'any.only': 'Invalid Visibility',
  }),
  is_archived: Joi.boolean().default(false).optional().messages({
    'boolean.base': 'is_archived must be a boolean',
  }),
}).options({ allowUnknown: false });

const changeDocumentStatusValidationSchema = Joi.object({
  id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'id must be a string',
    'string.pattern.base': 'id must be a valid MongoDB ObjectId',
    'any.required': 'id is required',
  }),
  status: Joi.string()
    .valid('pending', 'in-review', 're-submit', 'approved')
    .optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Invalid status',
    }),
}).options({ allowUnknown: false });

const getAllDocumentsValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional().default(''),
  category_id: Joi.string()
    .pattern(objectIdRegex)
    .allow('')
    .optional()
    .messages({
      'string.base': 'category_id must be a string',
      'string.pattern.base': 'category_id must be a valid MongoDB ObjectId',
    }),
}).options({ allowUnknown: false });

export {
  createDocumentValidationSchema,
  updateDocumentValidationSchema,
  createManyDocumentsValidationSchema,
  getAllDocumentsValidationSchema,
  changeDocumentStatusValidationSchema,
};
