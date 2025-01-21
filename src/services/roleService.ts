import roleRepository from '../dbAccess/roleRepository';
import { IRole } from '../models/roleModel';
import CustomError from '../utils/CustomError';

// Service to create a new role
const createRole = async (payload: IRole) => {
  const existingRole = await roleRepository.findRoleByName(payload.name);
  if (existingRole) {
    throw new CustomError('Role already exists', 400);
  }
  return await roleRepository.createRole(payload);
};

// Service to find a role by name
const findRoleByName = async (name: string) => {
  const role = await roleRepository.findRoleByName(name);
  if (!role) {
    throw new CustomError('Role not found', 400);
  }
  return role;
};

// Service to get all roles
const findAllRoles = async () => {
  return await roleRepository.findAllRoles();
};

// Service to update role details
const updateRole = async (
  roleId: string,
  payload: Partial<{ name: string; permissions: Record<string, string[]> }>
) => {
  const updatedRole = await roleRepository.updateRole(roleId, payload);
  if (!updatedRole) {
    throw new CustomError('Role not found', 400);
  }
  return updatedRole;
};

// Service to delete a role
const deleteRole = async (roleId: string) => {
  const deletedRole = await roleRepository.deleteRole(roleId);
  if (!deletedRole) {
    throw new CustomError('Role not found', 400);
  }
  return deletedRole;
};

// Service to assign permissions to a module for a specific role
const assignPermissionsToModule = async (
  roleId: string,
  module: string,
  permissions: string[]
) => {
  const updatedRole = await roleRepository.assignPermissionsToModule(
    roleId,
    module,
    permissions
  );
  if (!updatedRole) {
    throw new CustomError('Role not found', 400);
  }
  return updatedRole;
};

const roleServices = {
  createRole,
  findRoleByName,
  findAllRoles,
  updateRole,
  deleteRole,
  assignPermissionsToModule,
};

export default roleServices;
