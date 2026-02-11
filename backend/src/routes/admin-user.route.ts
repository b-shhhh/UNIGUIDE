import { Router } from "express";
import {
  listAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from "../controllers/admin-user.controller";

const router = Router();

router.get("/", listAdminUsers);
router.get("/:id", getAdminUser);
router.post("/", createAdminUser);
router.put("/:id", updateAdminUser);
router.delete("/:id", deleteAdminUser);

export default router;
