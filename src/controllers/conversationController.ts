/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as ConversationService from '../services/conversationService';
import catchAsync from '../utils/catchAsync';

export const createConversation = catchAsync(
  async (req: Request, res: Response) => {
    const { participants, subject } = req.body;
    const conversation = await ConversationService.createConversation(
      participants,
      subject
    );
    res.status(201).json({ success: true, data: conversation });
  }
);

export const getConversations = catchAsync(
  async (req: Request, res: Response) => {
    const user: any = req.user;
    const userId = user.id;
    const conversations =
      await ConversationService.getConversationsForUser(userId);
    res.status(200).json({ success: true, data: conversations });
  }
);

export const addMessage = catchAsync(async (req: Request, res: Response) => {
  const { conversation_id, content } = req.body;
  const user: any = req.user;
  const sender = user.id;
  const message = await ConversationService.addMessageToConversation(
    conversation_id,
    sender,
    content
  );
  res.status(201).json({ success: true, data: message });
});
