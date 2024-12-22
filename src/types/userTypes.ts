export interface UserType {
  name: string;
  email: string;
  password: string;
  role: string;
  is_verified?: boolean;
  otp?: string;
  otp_expiry?: Date;
  last_otp_sent_at?: Date;
  active?: boolean;
}

export default UserType;
