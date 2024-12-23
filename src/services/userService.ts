import crypto from 'crypto';
import userRepository from '../dbAccess/userRepository';
import UserType from '../types/userTypes';
import emailService from './emailService';
import { RegistrationEmailTemplate } from '../emails/RegistrationTemplates';
import roleRepository from '../dbAccess/roleRepository';
import CustomError from '../utils/CustomError';

const create = async (payload: UserType) => {
  const { email, name, password } = payload;
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const role = await roleRepository.findRoleByName('student');

  if (!role) {
    throw new CustomError('No role is created with that name', 400);
  }

  const newPayload = {
    email,
    name,
    password,
    role: role?.id,
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
