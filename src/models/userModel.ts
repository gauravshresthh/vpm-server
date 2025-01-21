/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: mongoose.Types.ObjectId;
  is_verified?: boolean;
  otp?: string;
  otp_expiry?: Date;
  last_otp_sent_at?: Date;
  active?: boolean;
  ip_address?: string;
  user_agent?: string;
  login_at?: Date;
  photo?: string;
  created_at: Date;
  updated_at: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, unique: true, maxlength: 255 },
  password: { type: String, required: true, maxlength: 255 },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  is_verified: {
    type: Boolean,
    default: false,
  },
  otp: { type: String, required: false },
  otp_expiry: { type: Date, required: false },
  last_otp_sent_at: { type: Date, required: false },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  ip_address: { type: String, maxlength: 255 },
  user_agent: { type: String, maxlength: 255 },
  login_at: { type: Date },
  photo: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.pre<Query<any, IUser>>(/^find/, function (next) {
  this.find({ active: true });
  next();
});

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.is_verified;
    return ret;
  },
});

UserSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.index({ role: 1, active: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
