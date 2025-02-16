/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { InvitationModel, IInvitation } from '../models/invitationModel';

const createInvitation = async (payload: {
  email: string;
  role: mongoose.Schema.Types.ObjectId;
  token: string;
  expires_at: Date;
  message?: string;
}): Promise<IInvitation> => {
  return await InvitationModel.create(payload);
};

const findOne = async (payload: any) => {
  return await InvitationModel.findOne(payload);
};

const getInvitationById = async (
  id: mongoose.Schema.Types.ObjectId
): Promise<IInvitation | null> => {
  return await InvitationModel.findById(id).populate('invitedBy');
};

const getInvitationsByEmail = async (email: string): Promise<IInvitation[]> => {
  return await InvitationModel.find({ email }).populate('invitedBy');
};

const getPendingInvitations = async (): Promise<IInvitation[]> => {
  return await InvitationModel.find({ status: 'pending' }).populate(
    'invitedBy'
  );
};

const updateInvitationStatus = async (
  invitationId: mongoose.Types.ObjectId,
  status: 'accepted' | 'rejected' | 'expired'
): Promise<IInvitation | null> => {
  return await InvitationModel.findByIdAndUpdate(
    invitationId,
    { status },
    { new: true }
  );
};

const invitationRepository = {
  createInvitation,
  findOne,
  getInvitationById,
  getInvitationsByEmail,
  getPendingInvitations,
  updateInvitationStatus,
};

export default invitationRepository;
