import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

export default router;
