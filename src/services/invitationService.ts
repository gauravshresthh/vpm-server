import mongoose from 'mongoose';
import invitationRepository from '../dbAccess/invitationRepository';
import userRepository from '../dbAccess/userRepository';
import CustomError from '../utils/CustomError';
import crypto from 'crypto';
import emailService from './emailService';
import roleRepository from '../dbAccess/roleRepository';
import { CompleteRegistrationEmailTemplate } from '../emails/CompleteRegistrationEmailTemplate';
import { InvitationModel } from '../models/invitationModel';

export const invite = async (payload: {
  email: string;
  role: mongoose.Schema.Types.ObjectId;
  message: string | undefined;
}) => {
  const { email, role, message } = payload;
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new CustomError('User already exists', 400);
  }

  const roleExists = await roleRepository.findRoleById(role);
  if (!roleExists) {
    throw new CustomError('Role does not exists', 400);
  }

  // ✅ Generate a secure invite token
  const token = crypto.randomBytes(32).toString('hex');

  // ✅ Set token expiry (e.g., 48 hours)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);
  const data = {
    email,
    role,
    token,
    status: 'pending',
    expires_at: expiresAt,
    message,
  };
  const result = await invitationRepository.createInvitation(data);

  const inviteLink = `${process.env.FRONTEND_URL}/auth/accept-invite?token=${token}`;
  const emailPayload = {
    email,
    subject: 'You are invited to become a member of VPMS',
    message: message || 'You are invited to become a member of VPMS',
    htmlContent: CompleteRegistrationEmailTemplate(inviteLink),
  };

  await emailService.sendEmail(emailPayload);
  return result;
};

const acceptInvitation = async (payload: {
  token: string;
  name: string;
  password: string;
}) => {
  const { token, name, password } = payload;
  const invitation = await InvitationModel.findOne({
    token,
    status: 'pending',
  });
  if (!invitation) {
    throw new CustomError('Invalid or expired invite', 400);
  }

  if (new Date() > invitation.expires_at) {
    throw new CustomError('Invite has expired', 400);
  }

  // ✅ Create user
  const userPayload = {
    name,
    email: invitation.email,
    password: password,
    role: invitation.role,
    is_verified: true,
  };
  const result = await userRepository.createUser(userPayload);
  invitation.status = 'accepted';
  await invitation.save();
  return result;
};

const invitationService = {
  invite,
  acceptInvitation,
};

export default invitationService;
