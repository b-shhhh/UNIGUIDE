import { Router } from "express";
import { createUser, deleteUserById, getUserById, listUsers, updateUserById } from "../../controllers/admin/user.controller";

const router = Router();

router.get("/", listUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;

