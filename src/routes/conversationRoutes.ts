import express from 'express';
import * as ConversationController from '../controllers/conversationController';
import { authenticate } from '../middlewares/authenticate';
// import { authorize } from '../middlewares/authorize';
// import checkPermissions from '../middlewares/checkPermissions';
import sanitize from '../middlewares/sanitize';
import {
  addMessageValidationSchema,
  createConversationValidationSchema,
} from '../validations/conversationValidation';

const router = express.Router();

// Create a conversation
router.post(
  '/',
  authenticate,
  // authorize(['user', 'admin']),
  // checkPermissions('conversation-management', 'update'),
  sanitize(createConversationValidationSchema),
  ConversationController.createConversation
);
router.get('/', authenticate, ConversationController.getConversations);

// Add a message to a conversation
router.post(
  '/message',
  authenticate,
  // authorize(['user', 'admin']),
  // checkPermissions('conversation-management', 'update'),
  sanitize(addMessageValidationSchema),
  ConversationController.addMessage
);

export default router;
