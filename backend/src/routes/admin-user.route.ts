import { Router } from "express";
import {
  listAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from "../controllers/admin-user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", listAdminUsers);
router.get("/:id", getAdminUser);
router.post("/", createAdminUser);
router.put("/:id", updateAdminUser);
router.delete("/:id", deleteAdminUser);

export default router;
