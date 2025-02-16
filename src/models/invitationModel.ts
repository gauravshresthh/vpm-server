import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
  email: string;
  role: mongoose.Types.ObjectId;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  message: string;
  expires_at: Date;
  created_at?: Date;
}

const InvitationSchema: Schema<IInvitation> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    token: { type: String, required: true, unique: true },
    status: { type: String, default: 'pending' },
    message: {
      type: String,
    },
    expires_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const InvitationModel = mongoose.model<IInvitation>(
  'Invitation',
  InvitationSchema
);
