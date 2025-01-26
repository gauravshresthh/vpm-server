import { Request, Response } from 'express';
import messageService from '../services/messageService';
import catchAsync from '../utils/catchAsync';

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { conversation_id } = req.params;
  const messages =
    await messageService.getMessagesByConversation(conversation_id);
  res.status(200).json({ success: true, data: messages });
});
