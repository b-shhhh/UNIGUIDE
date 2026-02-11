import { Router } from "express";
import {
  createCountryAdmin,
  deleteCountryAdmin,
  getCountryAdmin,
  listCountriesAdmin,
  updateCountryAdmin,
} from "../../controllers/admin/country.controller";

const router = Router();

router.get("/", listCountriesAdmin);
router.get("/:id", getCountryAdmin);
router.post("/", createCountryAdmin);
router.put("/:id", updateCountryAdmin);
router.delete("/:id", deleteCountryAdmin);

export default router;

