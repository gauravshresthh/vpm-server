import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import invitationService from '../services/invitationService';

const invite = catchAsync(async (req: Request, res: Response) => {
  const { email, role, message } = req.body;

  const payload = { email, role, message };

  const result = await invitationService.invite(payload);

  res.status(201).json({
    success: true,
    message: 'User invited successfully',
    data: result,
  });
});

const acceptInvitation = catchAsync(async (req: Request, res: Response) => {
  const { token, name, password } = req.body;

  const payload = { token, name, password };

  const result = await invitationService.acceptInvitation(payload);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export default {
  invite,
  acceptInvitation,
};
