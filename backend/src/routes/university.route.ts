import { Router } from "express";
import {
  getCountries,
  getUniversities,
  getUniversityDetail,
  getCourses,
  getCoursesByCountry
} from "../controllers/university.controller";

const router = Router();

// Countries
router.get("/countries", getCountries);

// Universities by country
router.get("/country/:country", getUniversities);

// University details
router.get("/:universityId", getUniversityDetail);

// Courses
router.get("/courses", getCourses);
router.get("/courses/:course", getCoursesByCountry);

export default router;
