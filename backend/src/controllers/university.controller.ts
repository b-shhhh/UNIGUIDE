import { Request, Response } from "express";
import { getCountriesService, getUniversitiesService, getUniversityDetailService, getCoursesService } from "@/services/university.service";

export const getCountries = async (_req: Request, res: Response) => {
  const countries = await getCountriesService();
  res.status(200).json({ success: true, data: countries });
};

export const getUniversities = async (req: Request, res: Response) => {
  const { country } = req.params;
  const universities = await getUniversitiesService(country);
  res.status(200).json({ success: true, data: universities });
};

export const getUniversityDetail = async (req: Request, res: Response) => {
  const { universityId } = req.params;
  const uni = await getUniversityDetailService(universityId);
  res.status(200).json({ success: true, data: uni });
};

export const getCourses = async (_req: Request, res: Response) => {
  const courses = await getCoursesService();
  res.status(200).json({ success: true, data: courses });
};

export const getCoursesByCountry = async (req: Request, res: Response) => {
  const { course } = req.params;
  const data = await getCoursesService(course);
  res.status(200).json({ success: true, data });
};
