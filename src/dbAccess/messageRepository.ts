import { IMessage, MessageModel } from '../models/messageModel';

const createMessage = async (data: Partial<IMessage>): Promise<IMessage> => {
  return await MessageModel.create(data);
};

const getMessagesByConversation = async (
  conversationId: string
): Promise<IMessage[]> => {
  return await MessageModel.find({ conversation: conversationId }).populate(
    'sender reply_to'
  );
};

const messageRepository = {
  createMessage,
  getMessagesByConversation,
};

export default messageRepository;
