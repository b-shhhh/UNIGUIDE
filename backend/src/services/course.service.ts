import { getCsvCourseByName, getCsvCourses, getCsvCoursesByCountry } from "./csv-data.service";

// Get all courses
export const getAllCourses = async () => {
  return getCsvCourses();
};

// Get courses available in a specific country
export const getCoursesByCountry = async (country: string) => {
  return getCsvCoursesByCountry(country);
};

// Get course details by ID
export const getCourseById = async (id: string) => {
  const course = await getCsvCourseByName(id);
  if (!course) throw new Error("Course not found");
  return course;
};
