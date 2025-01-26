import mongoose from 'mongoose';
import { AssignmentModel, IAssignment } from '../models/assignmentModel';

const assignConversation = async (
  conversationId: mongoose.Types.ObjectId,
  assigned_to: mongoose.Types.ObjectId
): Promise<IAssignment> => {
  return await AssignmentModel.create({
    conversation: conversationId,
    assigned_to,
  });
};

const getAssignmentsByUser = async (
  userId: mongoose.Types.ObjectId
): Promise<IAssignment[]> => {
  return await AssignmentModel.find({ assigned_to: userId }).populate(
    'conversation'
  );
};

const assignmentRepository = {
  assignConversation,
  getAssignmentsByUser,
};

export default assignmentRepository;
