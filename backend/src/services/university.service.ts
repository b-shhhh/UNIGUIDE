import {
  getCsvUniversities,
  getCsvCountries,
  getCsvCourseByName,
  getCsvCourses,
  getCsvUniversitiesByCountry,
  getCsvUniversityById
} from "./csv-data.service";

export const getAllUniversitiesService = async () => {
  return getCsvUniversities();
};

/**
 * Get all distinct countries
 */
export const getCountriesService = async (): Promise<string[]> => {
  return getCsvCountries();
};

/**
 * Get universities by country
 */
export const getUniversitiesService = async (country: string) => {
  return getCsvUniversitiesByCountry(country);
};

/**
 * Get university details by ID
 */
export const getUniversityDetailService = async (universityId: string) => {
  const uni = await getCsvUniversityById(universityId);
  if (!uni) throw new Error("University not found");
  return uni;
};

/**
 * Get all courses, or filter by course name
 */
export const getCoursesService = async (courseName?: string) => {
  if (courseName) {
    const course = await getCsvCourseByName(courseName);
    if (!course) throw new Error("Course not found");
    return course;
  } else {
    return getCsvCourses();
  }
};
