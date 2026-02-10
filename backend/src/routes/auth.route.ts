// src/routes/auth.route.ts
import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// Profile update
router.put("/profile/:id", authController.updateProfile);

// Change password
router.put("/change-password/:id", authController.changePassword);

export default router;
