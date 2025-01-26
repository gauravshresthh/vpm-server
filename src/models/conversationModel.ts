import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  subject?: string;
  last_message?: mongoose.Types.ObjectId;
  unread_count: Map<string, number>;
}

const ConversationSchema: Schema<IConversation> = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // User IDs in conversation
    subject: { type: String }, // Optional subject or title
    last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unread_count: { type: Map, of: Number }, // Map<UserID, UnreadCount>
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const ConversationModel: Model<IConversation> =
  mongoose.model<IConversation>('Conversation', ConversationSchema);
