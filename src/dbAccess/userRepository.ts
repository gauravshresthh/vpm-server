import { User } from '../models/userModel';
import UserType from '../types/userTypes';

// Create a new user
const createUser = async (payload: UserType) => {
  const user = new User(payload);
  return await user.save();
};

// Find a user by email
const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// Find all users
const findAllUsers = async () => {
  return await User.find();
};

// Update user details
const updateUser = async (
  userId: string,
  payload: Partial<{
    username: string;
    email: string;
    password: string;
    role: string;
  }>
) => {
  return await User.findByIdAndUpdate(userId, payload, { new: true });
};

// Delete a user
const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};

const userRepository = {
  createUser,
  findUserByEmail,
  findAllUsers,
  updateUser,
  deleteUser,
};

export default userRepository;
