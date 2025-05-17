/* eslint-disable @typescript-eslint/no-explicit-any */
import courseRepository from '../dbAccess/courseRepository';
import roleRepository from '../dbAccess/roleRepository';
import { StudentIntegrationEmailTemplate } from '../emails/StudentIntegrationEmailTemplate';
import { User } from '../models/userModel';
import CustomError from '../utils/CustomError';
import emailService from './emailService';

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

  if (user) {
    throw new CustomError(`You account has already been created.`, 400);
  }

  if (!user) {
    const newUser = new User({
      name: `${first_name} ${last_name}`,
      email,
      dob,
      role: role.id,
    });
    user = await newUser.save();
  }

  const courseDocs = await courseRepository.createCourses(courses);
  const courseIds = courseDocs.map((course: any) => course._id);

  // Link the Courses to the User
  user.courses = courseIds;
  await user.save();

  const inviteLink = `${process.env.FRONTEND_URL}/auth/sign-in`;
  const emailPayload = {
    email,
    subject: 'Congratulations, you account has been successfully created',
    message: 'Congratulations, you account has been successfully created',
    htmlContent: StudentIntegrationEmailTemplate(inviteLink),
  };
  await emailService.sendEmail(emailPayload);

  return {
    student: user,
    courses: courseDocs,
  };
};

export default {
  integrateStudent,
};
