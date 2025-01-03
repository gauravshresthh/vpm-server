import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: Map<string, string[]>;
}

const RoleSchema: Schema<IRole> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: {
      type: Map,
      of: [String],
      validate: {
        validator: (value: Map<string, string[]>) => {
          const allowedPermissions = [
            'all',
            'read',
            'write',
            'create',
            'delete',
          ];
          return Array.from(value.values()).every((actions) =>
            actions.every((action) => allowedPermissions.includes(action))
          );
        },
        message:
          'Permissions must only include one of ["all", "read", "write", "create", "delete"].',
      },
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
