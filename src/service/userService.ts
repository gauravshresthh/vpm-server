import { IUser, User } from '../models/userModel';

const create = async (payload: IUser) => {
  const user = new User(payload);
  return await user.save();
};

export default {
  create,
};
