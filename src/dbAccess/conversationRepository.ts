import mongoose from 'mongoose';
import { ConversationModel, IConversation } from '../models/conversationModel';

const createConversation = async (
  participants: string[],
  subject?: string
): Promise<IConversation> => {
  return await ConversationModel.create({ participants, subject });
};

const getConversationById = async (
  id: string
): Promise<IConversation | null> => {
  return await ConversationModel.findById(id).populate(
    'participants last_message'
  );
};

const getConversationsForUser = async (
  userId: mongoose.Types.ObjectId
): Promise<IConversation[]> => {
  return await ConversationModel.find({ participants: userId }).populate(
    'last_message'
  );
};

const updateUnreadCount = async (
  conversationId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  count: number
): Promise<void> => {
  await ConversationModel.findByIdAndUpdate(conversationId, {
    $set: { [`unread_count.${userId}`]: count },
  });
};

const conversationRepository = {
  createConversation,
  getConversationById,
  getConversationsForUser,
  updateUnreadCount,
};

export default conversationRepository;
