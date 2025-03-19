/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { User } from '../models/userModel';
import { UserType, UpdateUserType } from '../types/userTypes';
import roleRepository from './roleRepository';
import { DocumentModel } from '../models/documentModel';

// Create a new user
const createUser = async (payload: UserType) => {
  const user = new User(payload);
  return await user.save();
};

const createUserFromIntegration = async (payload: any) => {
  const user = new User(payload);
  return await user.save();
};

// Find a user by email
const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

const findUserByEmailWithPassword = async (email: string) => {
  return await User.findOne({ email }).select('+password');
};

// Find all users with pagination
const findAllUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  const skip = (page - 1) * limit;

  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const totalCount = await User.countDocuments(searchFilter);
  const result = await User.find(searchFilter)
    .skip(skip)
    .limit(limit)
    .populate('roles', 'name')
    .exec();

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    result,
  };
};

// Update user details
const updateUser = async (
  user_id: string,
  payload: Partial<{
    username: string;
    email: string;
    password: string;
    roles: mongoose.Types.ObjectId[];
  }>
) => {
  return await User.findByIdAndUpdate(user_id, payload, { new: true });
};

// Delete a user
const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

const findById = async (user_id: string) => {
  return await User.findById(user_id);
};

const updateById = async (user_id: string, payload: UpdateUserType) => {
  return await User.findByIdAndUpdate(user_id, payload, { new: true });
};

const deleteMultipleByIds = async (
  user_ids: mongoose.Schema.Types.ObjectId[]
) => {
  const result = await User.deleteMany({
    _id: { $in: user_ids },
  });

  return result;
};

const getUserAnalytics = async () => {
  const all_users = await User.countDocuments();
  const totalDocuments = await DocumentModel.countDocuments();
  // Count documents by file_type
  const fileTypes = [
    'pdf',
    'png',
    'csv',
    'doc',
    'docx',
    'image',
    'other',
    'jpeg',
    'jpg',
  ];
  const fileTypeCounts = await DocumentModel.aggregate([
    { $match: { file_type: { $in: fileTypes } } },
    { $group: { _id: '$file_type', count: { $sum: 1 } } },
  ]);

  // Transform the result into an object for better readability
  const documentsByFileType = fileTypeCounts.reduce(
    (acc: Record<string, number>, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    },
    {}
  );

  const allRoles = await roleRepository.findAllRoleWithNamesOnly();

  const role_wise_counts = [];
  for (const role of allRoles) {
    const userCount = await User.countDocuments({
      roles: { $in: [role._id] },
    });
    role_wise_counts.push({
      name: role.name,
      count: userCount,
    });
  }

  return {
    all_users,
    role_wise_counts,
    documents: {
      totalDocuments,
      documentsByFileType,
    },
  };
};

const userRepository = {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findAllUsers,
  updateUser,
  deleteUser,
  findById,
  updateById,
  deleteMultipleByIds,
  getUserAnalytics,
  createUserFromIntegration,
};

export default userRepository;
