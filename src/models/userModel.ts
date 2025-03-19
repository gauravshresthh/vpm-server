/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Query } from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: mongoose.Types.ObjectId[];
  courses: mongoose.Types.ObjectId[];
  is_verified?: boolean;
  otp?: string;
  otp_expiry?: Date;
  last_otp_sent_at?: Date;
  active?: boolean;
  ip_address?: string;
  user_agent?: string;
  login_at?: Date;
  photo?: string;
  phone_number?: string;
  dob?: string;
  created_at?: Date;
  updated_at?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
    email: { type: String, required: true, unique: true, maxlength: 255 },
    dob: { type: String },
    password: { type: String, maxlength: 255 },
    roles: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    ],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
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
    photo: { type: String, maxlength: 255, default: '' },
    phone_number: { type: String, maxlength: 255, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

UserSchema.pre<Query<any, IUser>>(/^find/, function (next) {
  // Only exclude 'password' if it's not explicitly requested
  const selectQuery = this.getQuery().select;

  // If '+password' is explicitly included in the select query, we don't exclude it
  if (selectQuery && !selectQuery.includes('+password')) {
    this.select('-password');
  }
  next();
});

UserSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    doc.password = undefined;
  }
});

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
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

UserSchema.index({ roles: 1, active: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
