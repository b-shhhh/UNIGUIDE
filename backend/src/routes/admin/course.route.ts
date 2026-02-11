import { Router } from "express";
import { createCourseAdmin, deleteCourseAdmin, getCourseAdmin, listCoursesAdmin, updateCourseAdmin } from "../../controllers/admin/course.controller";

const router = Router();

router.get("/", listCoursesAdmin);
router.get("/:id", getCourseAdmin);
router.post("/", createCourseAdmin);
router.put("/:id", updateCourseAdmin);
router.delete("/:id", deleteCourseAdmin);

export default router;

