import { Course } from "../models/course.model";

// Get all courses
export const getAllCourses = async () => {
  return await Course.find();
};

// Get courses available in a specific country
export const getCoursesByCountry = async (country: string) => {
  return await Course.find({ countries: country });
};

// Get course details by ID
export const getCourseById = async (id: string) => {
  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found");
  return course;
};
