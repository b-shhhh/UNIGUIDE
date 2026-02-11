import { Router } from "express";
import { adminLogout, adminProfile } from "../../controllers/admin/admin.controller";
import userAdminRoutes from "./user.route";
import universityAdminRoutes from "./university.route";
import courseAdminRoutes from "./course.route";
import countryAdminRoutes from "./country.route";

const router = Router();

router.get("/profile", adminProfile);
router.post("/logout", adminLogout);
router.use("/users", userAdminRoutes);
router.use("/universities", universityAdminRoutes);
router.use("/courses", courseAdminRoutes);
router.use("/countries", countryAdminRoutes);

export default router;

