import mongoose from 'mongoose';
import { IRole, Role } from '../models/roleModel';

// Create a new role
const create = async (payload: IRole) => {
  const role = new Role(payload);
  return await role.save();
};

// Find a role by name
const findRoleByName = async (name: string) => {
  return await Role.findOne({ name });
};

// Find a role by Id
const findRoleById = async (roleId: mongoose.Schema.Types.ObjectId) => {
  return await Role.findOne({ _id: roleId });
};

// Find only role name by Id
const findOnlyRoleNameById = async (roleId: mongoose.Schema.Types.ObjectId) => {
  return await Role.findOne({ _id: roleId }).select('name');
};

// Find all roles
const findAll = async () => {
  return await Role.find();
};

const findAllRoleWithNamesOnly = async () => {
  return await Role.find().select('name');
};

// Update role details
const updateById = async (
  roleId: string,
  payload: Partial<{
    name: string;
    permissions: Record<string, string[]>;
  }>
) => {
  return await Role.findByIdAndUpdate(roleId, payload, { new: true });
};

// Delete a role
const deleteRoleById = async (roleId: string) => {
  return await Role.findByIdAndDelete(roleId);
};

// Assign permissions to a module for a specific role
const assignPermissionsToModule = async (
  roleId: string,
  module: string,
  permissions: string[]
) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error('Role not found');
  }

  if (!(role.permissions instanceof Map)) {
    throw new Error('Role permissions must be a Map');
  }

  role.permissions.set(module, permissions);

  return await role.save();
};

const roleRepository = {
  create,
  findRoleById,
  findOnlyRoleNameById,
  findRoleByName,
  findAll,
  updateById,
  deleteRoleById,
  assignPermissionsToModule,
  findAllRoleWithNamesOnly,
};

export default roleRepository;
