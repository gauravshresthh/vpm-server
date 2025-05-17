import crypto from 'crypto';
import userRepository from '../dbAccess/userRepository';
import { UserType, UpdateUserType } from '../types/userTypes';
import emailService from './emailService';
import { RegistrationEmailTemplate } from '../emails/RegistrationTemplates';
import roleRepository from '../dbAccess/roleRepository';
import CustomError from '../utils/CustomError';
import mongoose from 'mongoose';

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

const findUserByEmailWithPassword = async (email: string) => {
  const result = userRepository.findUserByEmailWithPassword(email);
  return result;
};

const findAll = async (page: number, limit: number, search: string) => {
  const result = userRepository.findAllUsers(page, limit, search);
  return result;
};

const findById = async (user_id: string) => {
  const result = userRepository.findById(user_id);
  return result;
};

const updateById = async (user_id: string, payload: UpdateUserType) => {
  const result = userRepository.updateById(user_id, payload);
  return result;
};

const deleteMultipleByIds = async (
  payload: mongoose.Schema.Types.ObjectId[]
) => {
  const result = userRepository.deleteMultipleByIds(payload);
  return result;
};

const getUserAnalytics = async () => {
  const result = userRepository.getUserAnalytics();
  return result;
};

export default {
  create,
  findUserByEmail,
  findUserByEmailWithPassword,
  findAll,
  findById,
  updateById,
  deleteMultipleByIds,
  getUserAnalytics,
};
