/* eslint-disable @typescript-eslint/no-explicit-any */
import courseRepository from '../dbAccess/courseRepository';
import roleRepository from '../dbAccess/roleRepository';
import { User } from '../models/userModel';
import CustomError from '../utils/CustomError';

interface Course {
  course_name: string;
  course_code: string;
}

interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  courses: Course[];
}

const integrateStudent = async (payload: StudentData) => {
  const { first_name, last_name, dob, email, courses } = payload;
  const role = await roleRepository.findRoleByName('student');
  if (!role) throw new CustomError('No role is created with that name', 400);

  // Create or Find the User
  let user = await User.findOne({ email });
  if (!user) {
    const newUser = new User({
      name: `${first_name} ${last_name}`,
      email,
      dob,
      roles: [role.id],
    });
    user = await newUser.save();
  }

  const courseDocs = await courseRepository.createCourses(courses);
  const courseIds = courseDocs.map((course: any) => course._id);

  // Link the Courses to the User
  user.courses = courseIds;
  await user.save();

  return {
    student: user,
    courses: courseDocs,
  };
};

export default {
  integrateStudent,
};
