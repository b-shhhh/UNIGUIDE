import { Router } from "express";
import {
  register,
  login,
  whoAmI,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
const router = Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);
// Authenticated user profile and password routes
router.get("/whoami", authMiddleware, whoAmI);
router.get("/me", authMiddleware, whoAmI);
router.put("/update-profile", authMiddleware, upload.single("profilePic"), updateProfile);
router.put("/change-password", authMiddleware, changePassword);

// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
