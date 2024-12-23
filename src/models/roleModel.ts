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
      default: {},
    },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
