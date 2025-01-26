import mongoose from 'mongoose';
import assignmentRepository from '../dbAccess/assignmentRepository';
import { getIO } from '../socket';

export const assignConversationToUser = async (
  conversation_id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  const result = await assignmentRepository.assignConversation(
    conversation_id,
    userId
  );
  const io = getIO();
  io.to(conversation_id.toString()).emit('conversationUpdated', result);
  return result;
};

export const getAssignmentsForUser = async (
  userId: mongoose.Types.ObjectId
) => {
  await assignmentRepository.getAssignmentsByUser(userId);
};

const assignmentService = {
  assignConversationToUser,
  getAssignmentsForUser,
};

export default assignmentService;
