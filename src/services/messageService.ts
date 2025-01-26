import messageRepository from '../dbAccess/messageRepository';

export const getMessagesByConversation = async (conversationId: string) => {
  return await messageRepository.getMessagesByConversation(conversationId);
};

const messageService = {
  getMessagesByConversation,
};

export default messageService;
