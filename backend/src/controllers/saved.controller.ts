import { Request, Response } from "express";
import { saveUniversityService, getSavedUniversitiesService, removeSavedUniversityService } from "../services/user.service";

// Save a university
export const saveUniversity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Make sure auth middleware sets req.user
    if (!userId) throw new Error("Unauthorized");

    const universityId = Array.isArray(req.body.universityId) ? req.body.universityId[0] : req.body.universityId;
    const user = await saveUniversityService(userId, universityId);

    res.status(200).json({ success: true, data: user.savedUniversities });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get saved universities
export const getSavedUniversities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const savedUniversities = await getSavedUniversitiesService(userId);
    res.status(200).json({ success: true, data: savedUniversities });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove a saved university
export const removeSavedUniversity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const universityId = Array.isArray(req.params.universityId) ? req.params.universityId[0] : req.params.universityId;
    const user = await removeSavedUniversityService(userId, universityId);

    res.status(200).json({ success: true, data: user.savedUniversities });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
