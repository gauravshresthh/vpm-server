import mongoose, { isValidObjectId } from 'mongoose';
import conversationRepository from '../dbAccess/conversationRepository';
import messageRepository from '../dbAccess/messageRepository';
import { getIO } from '../socket';

export const createConversation = async (
  user_id: string,
  participants: string[],
  subject?: string,
) => {
  const newParticipantsListWithCurrentUserPopulated = [...participants, user_id];
  const uniqueParticipants = Array.from(
    new Set(
      newParticipantsListWithCurrentUserPopulated.filter(isValidObjectId)
    )
  );
  return await conversationRepository.createConversation(uniqueParticipants, subject);
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
  await conversationRepository.addLastMessageToConversation(conversation_id, message.id)
  await conversationRepository.updateUnreadCount(conversation_id, sender, 0);

  const io = getIO();
  io.to(conversation_id.toString()).emit('newMessage', {
    conversation_id: conversation_id.toString(), 
  });
  return message;
};

const conversationService = {
  createConversation,
  getConversationsForUser,
  addMessageToConversation,
};

export default conversationService;
