import { Router } from "express";
import {
  createUniversityAdmin,
  deleteUniversityAdmin,
  getUniversityAdmin,
  listUniversitiesAdmin,
  updateUniversityAdmin,
} from "../../controllers/admin/university.controller";

const router = Router();

router.get("/", listUniversitiesAdmin);
router.get("/:id", getUniversityAdmin);
router.post("/", createUniversityAdmin);
router.put("/:id", updateUniversityAdmin);
router.delete("/:id", deleteUniversityAdmin);

export default router;

