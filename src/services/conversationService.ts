import mongoose from 'mongoose';
import conversationRepository from '../dbAccess/conversationRepository';
import messageRepository from '../dbAccess/messageRepository';
import { getIO } from '../socket';

export const createConversation = async (
  participants: string[],
  subject?: string
) => {
  return await conversationRepository.createConversation(participants, subject);
};

export const getConversationsForUser = async (
  userId: mongoose.Types.ObjectId
) => {
  return await conversationRepository.getConversationsForUser(userId);
};

export const addMessageToConversation = async (
  conversation_id: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId,
  content: string
) => {
  const message = await messageRepository.createMessage({
    conversation: conversation_id,
    sender,
    content,
  });
  await conversationRepository.updateUnreadCount(conversation_id, sender, 0);
  // Emit the new message to all participants
  const io = getIO();
  io.to(conversation_id.toString()).emit('newMessage', {
    conversation_id: conversation_id.toString(), // Ensure it's a string
    message,
  });
  console.log('new message emitted');
  return message;
};

const conversationService = {
  createConversation,
  getConversationsForUser,
  addMessageToConversation,
};

export default conversationService;
