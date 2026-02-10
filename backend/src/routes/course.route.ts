// src/routes/course.route.ts
import { Router } from "express";
import { CourseController } from "../controllers/course.controller";

const router = Router();
const courseController = new CourseController();

// Get all courses
router.get("/", courseController.getAllCourses);

// Get course by name
router.get("/:name", courseController.getCourseByName);

export default router;
