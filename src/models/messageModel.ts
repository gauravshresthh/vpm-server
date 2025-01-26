import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  is_read: boolean;
  attachments?: string[];
  reply_to?: mongoose.Types.ObjectId;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    attachments: [{ type: String }], // Array of file URLs
    reply_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Optional reference to a replied message
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  'Message',
  MessageSchema
);
