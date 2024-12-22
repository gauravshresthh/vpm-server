/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  is_verified?: boolean;
  otp?: string;
  otp_expiry?: Date;
  last_otp_sent_at?: Date;
  active?: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        'super-admin',
        'system-admin',
        'college-admin',
        'vpo',
        'vp-provider',
        'facilitator',
        'trainer',
        'student',
      ],
    },
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
  },
  { timestamps: true }
);

UserSchema.pre<Query<any, IUser>>(/^find/, function (next) {
  this.find({ active: true }); // Automatically exclude inactive users
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
