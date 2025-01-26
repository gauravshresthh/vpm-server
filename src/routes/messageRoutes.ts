import express from 'express';
import * as MessageController from '../controllers/messageController';
import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

router.get('/:conversation_id', authenticate, MessageController.getMessages);

export default router;
