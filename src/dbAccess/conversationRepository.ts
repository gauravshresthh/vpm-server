import mongoose from 'mongoose';
import { ConversationModel, IConversation } from '../models/conversationModel';

const createConversation = async (
  participants: string[],
  subject?: string
): Promise<IConversation> => {
  return await ConversationModel.create({ participants, subject });
};

const getConversationById = async (
  id: mongoose.Types.ObjectId
): Promise<IConversation | null> => {
  return await ConversationModel.findById(id).populate(
    'participants last_message'
  );
};

const getConversationsForUser = async (
  userId: mongoose.Types.ObjectId
): Promise<IConversation[]> => {
  return await ConversationModel.find({ participants: userId })
    .populate('last_message')
    .populate({
      path: 'participants',
      select: 'name photo email phone_number',
    })
    .sort({ updated_at: -1 });
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

const addLastMessageToConversation = async (
  conversation_id: mongoose.Types.ObjectId,
  last_message_id: string
): Promise<IConversation | null> => {
  return await ConversationModel.findByIdAndUpdate(
    conversation_id,
    { last_message: last_message_id },
    { new: true }
  );
};

const conversationRepository = {
  createConversation,
  getConversationById,
  getConversationsForUser,
  updateUnreadCount,
  addLastMessageToConversation,
};

export default conversationRepository;
