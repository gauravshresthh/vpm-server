import mongoose from 'mongoose';
import { config } from '../config/config';
import { Role } from '../models/roleModel';

const seedRolesWithPermissions = async () => {
  const roles = [
    {
      name: 'super-admin',
      permissions: {
        'college-management': ['all'],
        'course-management': ['all'],
        'student-management': ['all'],
        'facility-management': ['all'],
        'placement-management': ['all'],
        'document-management': ['all'],
        'role-management': ['all'],
      },
    },
    {
      name: 'system-admin',
      permissions: {
        'college-settings': ['all'],
        'course-management': ['all'],
        'student-management': ['all'],
        'facility-management': ['all'],
        'placement-management': ['all'],
        'role-management': ['all'],
      },
    },
    {
      name: 'vpo',
      permissions: {
        'college-settings': ['read', 'write'],
        'course-management': ['read'],
        'student-management': ['read', 'write'],
        'facility-management': ['read', 'write'],
        'placement-management': ['read', 'write'],
        'role-management': ['all'],
      },
    },
    {
      name: 'vp-provider',
      permissions: {
        'college-settings': ['read', 'write'],
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
        'student-management': ['read', 'write'],
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
        'student-management': ['read', 'write'],
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
