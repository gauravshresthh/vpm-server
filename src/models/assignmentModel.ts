import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  conversation: mongoose.Types.ObjectId;
  assigned_to: mongoose.Types.ObjectId;
  status: 'pending' | 'in_progress' | 'completed';
}

const AssignmentSchema: Schema<IAssignment> = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User ID assigned to this conversation
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const AssignmentModel: Model<IAssignment> = mongoose.model<IAssignment>(
  'Assignment',
  AssignmentSchema
);
