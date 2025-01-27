import express from 'express';
import * as AssignmentController from '../controllers/assignmentController';
import { authenticate } from '../middlewares/authenticate';
import sanitize from '../middlewares/sanitize';
import { assignConversationValidationSchema } from '../validations/conversationValidation';

const router = express.Router();

// Assign a conversation to a user
router.post(
  '/assign',
  authenticate,
  // authorize(['admin']),
  // checkPermissions('conversation-management', 'update'),
  sanitize(assignConversationValidationSchema),
  AssignmentController.assignConversation
);
router.get('/', authenticate, AssignmentController.getAssignments);

export default router;
