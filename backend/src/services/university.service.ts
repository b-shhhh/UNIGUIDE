import { University } from "../models/university.model";
import { Course } from "../models/course.model";

/**
 * Get all distinct countries
 */
export const getCountriesService = async (): Promise<string[]> => {
  const countries = await University.distinct("country");
  return countries;
};

/**
 * Get universities by country
 */
export const getUniversitiesService = async (country: string) => {
  const universities = await University.find({ country });
  return universities;
};

/**
 * Get university details by ID
 */
export const getUniversityDetailService = async (universityId: string) => {
  const uni = await University.findById(universityId);
  if (!uni) throw new Error("University not found");
  return uni;
};

/**
 * Get all courses, or filter by course name
 */
export const getCoursesService = async (courseName?: string) => {
  if (courseName) {
    const course = await Course.findOne({ name: courseName });
    if (!course) throw new Error("Course not found");
    return course;
  } else {
    return await Course.find();
  }
};
