import Joi from 'joi';

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
  filename: Joi.string().required().messages({
    'string.base': 'Filename must be a string',
    'any.required': 'Filename is required',
  }),
  file_type: Joi.string()
    .valid('pdf', 'csv', 'doc', 'docx', 'image', 'other')
    .optional()
    .messages({
      'string.base': 'File Type must be a string',
      'any.only': 'Invalid File Type',
    }),
  parent_id: Joi.string().optional().allow(null).messages({
    'string.base': 'Parent ID must be a string',
  }),
  category_id: Joi.string().required().messages({
    'string.base': 'Category_id must be a valid ObjectId',
    'any.required': 'Category is required',
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

// Validation schema for updating a document
const updateDocumentValidationSchema = Joi.object({
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
  parent_id: Joi.string().optional().allow(null).messages({
    'string.base': 'Parent ID must be a string',
  }),
  category: Joi.string().optional().messages({
    'string.base': 'Category must be a valid ObjectId',
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

export { createDocumentValidationSchema, updateDocumentValidationSchema };
