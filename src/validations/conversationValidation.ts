import Joi from 'joi';

// Regex to validate MongoDB ObjectId format
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Validation for creating a conversation
const createConversationValidationSchema = Joi.object({
  participants: Joi.array()
    .items(
      Joi.string().pattern(objectIdRegex).required().messages({
        'string.base': 'Participant must be a string',
        'string.pattern.base': 'Participant must be a valid MongoDB ObjectId',
        'any.required': 'Participant is required',
      })
    )
    .min(2)
    .required()
    .messages({
      'array.base': 'Participants must be an array of strings',
      'array.min': 'At least two participants are required',
      'any.required': 'Participants are required',
    }),
  subject: Joi.string().optional().messages({
    'string.base': 'Subject must be a string',
  }),
});

// Validation for adding a message to a conversation
const addMessageValidationSchema = Joi.object({
  conversation_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'Conversation ID must be a string',
    'string.pattern.base': 'Conversation ID must be a valid MongoDB ObjectId',
    'any.required': 'Conversation ID is required',
  }),
  content: Joi.string().required().messages({
    'string.base': 'Message content must be a string',
    'any.required': 'Message content is required',
  }),
});

// Validation for assigning a conversation
const assignConversationValidationSchema = Joi.object({
  conversation_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'Conversation ID must be a string',
    'string.pattern.base': 'Conversation ID must be a valid MongoDB ObjectId',
    'any.required': 'Conversation ID is required',
  }),
  user_id: Joi.string().pattern(objectIdRegex).required().messages({
    'string.base': 'User ID must be a string',
    'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
    'any.required': 'User ID is required',
  }),
});

export {
  createConversationValidationSchema,
  addMessageValidationSchema,
  assignConversationValidationSchema,
};
