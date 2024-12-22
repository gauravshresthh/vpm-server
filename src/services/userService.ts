import crypto from 'crypto';
import userRepository from '../dbAccess/userRepository';
import UserType from '../types/userTypes';
import emailService from './emailService';
import { RegistrationEmailTemplate } from '../emails/RegistrationTemplates';

const create = async (payload: UserType) => {
  const { email, name, password } = payload;
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const newPayload = {
    email,
    name,
    password,
    role: 'student',
    otp,
    otp_expiry: otpExpiry,
  };

  await userRepository.createUser(newPayload);
  await emailService.sendEmail({
    email,
    subject: 'Vocational Placement Management Registration',
    message: 'You registered to VPM successfully.',
    htmlContent: RegistrationEmailTemplate(
      `${process.env.API_URL}/registration/${email}`,
      otp
    ),
  });
  return payload;
};

const findUserByEmail = async (email: string) => {
  const result = userRepository.findUserByEmail(email);
  return result;
};

export default {
  create,
  findUserByEmail,
};
