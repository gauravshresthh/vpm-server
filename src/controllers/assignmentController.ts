/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import assignmentService from '../services/assignmentService';
import catchAsync from '../utils/catchAsync';

export const assignConversation = catchAsync(
  async (req: Request, res: Response) => {
    const { conversation_id, userId } = req.body;
    const assignment = await assignmentService.assignConversationToUser(
      conversation_id,
      userId
    );
    res.status(201).json({ success: true, data: assignment });
  }
);

export const getAssignments = catchAsync(
  async (req: Request, res: Response) => {
    const user: any = req.user;
    const userId = user.id;
    const assignments = await assignmentService.getAssignmentsForUser(userId);
    res.status(200).json({ success: true, data: assignments });
  }
);
