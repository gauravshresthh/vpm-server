/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { isValidObjectId } from 'mongoose';
import conversationRepository from '../dbAccess/conversationRepository';
import messageRepository from '../dbAccess/messageRepository';
import { getIO } from '../socket';
import emailService from './emailService';
import { MessageAndReplyEmailTemplate } from '../emails/MessageAndReplyEmailTemplate';

export const createConversation = async (
  user_id: string,
  participants: string[],
  subject?: string
) => {
  const newParticipantsListWithCurrentUserPopulated = [
    ...participants,
    user_id,
  ];
  const uniqueParticipants = Array.from(
    new Set(newParticipantsListWithCurrentUserPopulated.filter(isValidObjectId))
  );
  return await conversationRepository.createConversation(
    uniqueParticipants,
    subject
  );
};

export const getConversationsForUser = async (
  userId: mongoose.Types.ObjectId
) => {
  return await conversationRepository.getConversationsForUser(userId);
};

export const addMessageToConversation = async (
  conversation_id: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId,
  content: string,
  reply_to: mongoose.Types.ObjectId | undefined
) => {
  const message = await messageRepository.createMessage({
    conversation: conversation_id,
    sender,
    content,
    reply_to,
  });

  const conversation =
    await conversationRepository.getConversationById(conversation_id);
  const participants: any = conversation?.participants;
  const receivers: any = participants?.filter(
    (participant: any) => participant._id.toString() !== sender.toString()
  );
  if (receivers?.length) {
    receivers.forEach(async (receiver: any) => {
      await emailService.sendEmail({
        email: receiver.email,
        subject: reply_to
          ? 'Someone replied to your message on VPMS'
          : 'Someone messaged you on VPMS',
        message: reply_to
          ? 'Someone replied to your message on VPMS'
          : 'Someone messaged you on VPMS',
        htmlContent: MessageAndReplyEmailTemplate(
          content,
          `${process.env.FRONTEND_URL}/dashboard/inbox`
        ),
      });
    });
  } else {
    console.log('No receivers found');
  }

  await conversationRepository.addLastMessageToConversation(
    conversation_id,
    message.id
  );
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
