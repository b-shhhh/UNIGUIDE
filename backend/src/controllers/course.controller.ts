import { Request, Response } from "express";
import {
  getAllCoursesService,
  getCountriesByCourseService,
  getUniversitiesByCourseService
} from "@/services/course.service";

// Get all courses
export const getAllCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await getAllCoursesService();
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all countries offering a specific course
export const getCountriesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const countries = await getCountriesByCourseService(courseId);
    res.status(200).json({ success: true, data: countries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all universities offering a specific course
export const getUniversitiesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const universities = await getUniversitiesByCourseService(courseId);
    res.status(200).json({ success: true, data: universities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
