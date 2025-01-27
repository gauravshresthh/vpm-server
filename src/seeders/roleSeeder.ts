import mongoose from 'mongoose';
import { config } from '../config/config';
import { Role } from '../models/roleModel';

const seedRolesWithPermissions = async () => {
  const roles = [
    {
      name: 'system-admin',
      permissions: {
        'college-settings': ['create', 'read', 'update', 'delete'],
        'course-management': ['create', 'read', 'update', 'delete'],
        'student-management': ['create', 'read', 'update', 'delete'],
        'facility-management': ['create', 'read', 'update', 'delete'],
        'placement-management': ['create', 'read', 'update', 'delete'],
        'role-management': ['create', 'read', 'update', 'delete'],
      },
    },
    {
      name: 'vpo',
      permissions: {
        'college-settings': ['read', 'create'],
        'course-management': ['read'],
        'student-management': ['read', 'create'],
        'facility-management': ['read', 'create'],
        'placement-management': ['read', 'create'],
      },
    },
    {
      name: 'vp-provider',
      permissions: {
        'college-settings': ['read', 'create'],
        'course-management': ['read'],
        'student-management': ['read', 'create'],
        'facility-management': ['read', 'create'],
        'placement-management': ['read', 'create'],
        'role-management': ['read'],
      },
    },
    {
      name: 'facilitator',
      permissions: {
        'college-settings': ['read'],
        'course-management': ['read'],
        'student-management': ['read', 'create'],
        'facility-management': ['read'],
        'placement-management': ['read'],
        'role-management': ['read'],
      },
    },
    {
      name: 'trainer',
      permissions: {
        'college-settings': ['read'],
        'course-management': ['read', 'create'],
        'student-management': ['read', 'create'],
        'facility-management': ['read'],
        'placement-management': ['read'],
        'role-management': ['read'],
      },
    },
    {
      name: 'student',
      permissions: {
        'college-settings': ['read'],
        'course-management': ['read'],
        'student-management': ['read'],
      },
    },
  ];

  try {
    for (const role of roles) {
      await Role.updateOne(
        { name: role.name },
        { $set: { permissions: role.permissions } },
        { upsert: true }
      );
    }
    console.log('Roles with permissions seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};

const runSeeder = async () => {
  try {
    await mongoose.connect(config.dbUri);
    console.log('Connected to MongoDB');

    await seedRolesWithPermissions();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

runSeeder();
