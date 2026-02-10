// src/routes/university.route.ts
import { Router } from "express";
import {
  getCountries,
  getUniversities,
  getUniversityDetail,
  getCourses,
  getCoursesByCountry,
} from "../controllers/university.controller";

const router = Router();

// Get all countries
router.get("/countries", getCountries);

// Get universities by country
router.get("/universities/:country", getUniversities);

// Get university detail by ID
router.get("/university/:universityId", getUniversityDetail);

// Get all courses
router.get("/courses", getCourses);

// Get courses by country
router.get("/courses/:course", getCoursesByCountry);

export default router;
