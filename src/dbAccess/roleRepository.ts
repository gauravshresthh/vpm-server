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

// Find all roles
const findAll = async () => {
  return await Role.find();
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

  // Check if the role.permissions is a Map
  if (!(role.permissions instanceof Map)) {
    throw new Error('Role permissions must be a Map');
  }

  // Set the permissions for the module
  role.permissions.set(module, permissions);

  // Save the updated role
  return await role.save();
};

const roleRepository = {
  create,
  findRoleByName,
  findAll,
  updateById,
  deleteRoleById,
  assignPermissionsToModule,
};

export default roleRepository;
