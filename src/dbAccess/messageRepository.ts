/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMessage, MessageModel } from '../models/messageModel';

const createMessage = async (data: Partial<IMessage>): Promise<IMessage> => {
  return await MessageModel.create(data);
};

const getMessagesByConversation = async (
  conversationId: string
): Promise<any> => {
  // Fetch only parent messages (messages without reply_to)
  const parentMessages = await MessageModel.find({
    conversation: conversationId,
    $or: [{ reply_to: null }, { reply_to: { $exists: false } }],
  }).populate('sender');

  // Fetch replies for each parent message
  const messagesWithReplies = await Promise.all(
    parentMessages.map(async (message) => {
      const replies = await MessageModel.find({
        reply_to: message._id,
      }).populate('sender');
      return { ...message.toObject(), replies };
    })
  );

  return messagesWithReplies;
};

const messageRepository = {
  createMessage,
  getMessagesByConversation,
};

export default messageRepository;
