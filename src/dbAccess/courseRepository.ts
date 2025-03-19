/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseModel } from '../models/courseModel';

// Create multiple courses
const createCourses = async (courses: any) => {
  const savedCourses: any = [];

  for (const course of courses) {
    // Check if course with the same course_code exists
    let existingCourse = await CourseModel.findOne({
      course_code: course.course_code,
    });

    if (!existingCourse) {
      // Create new course if it doesn't exist
      existingCourse = new CourseModel(course);
      await existingCourse.save();
    }

    savedCourses.push(existingCourse);
  }

  return savedCourses;
};

const courseRepository = {
  createCourses,
};

export default courseRepository;
