import mongoose from 'mongoose';

export interface UserType {
  name: string;
  email: string;
  password: string;
  roles: mongoose.Types.ObjectId[];
  is_verified?: boolean;
  otp?: string;
  otp_expiry?: Date;
  last_otp_sent_at?: Date;
  active?: boolean;
}

export interface UpdateUserType {
  name?: string;
  email?: string;
  roles?: mongoose.Types.ObjectId[];
  photo?: string;
  phone_number?: string;
  active?: boolean;
}
