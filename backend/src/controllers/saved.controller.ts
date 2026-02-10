import { Request, Response } from "express";
import { saveUniversityService, getSavedUniversitiesService, removeSavedUniversityService } from "@/services/saved.service";

export const saveUniversity = async (req: Request, res: Response) => {
  const { universityId } = req.body;
  await saveUniversityService(req.user.id, universityId);
  res.status(200).json({ success: true, message: "University saved" });
};

export const getSavedUniversities = async (req: Request, res: Response) => {
  const saved = await getSavedUniversitiesService(req.user.id);
  res.status(200).json({ success: true, data: saved });
};

export const removeSavedUniversity = async (req: Request, res: Response) => {
  const { universityId } = req.body;
  await removeSavedUniversityService(req.user.id, universityId);
  res.status(200).json({ success: true, message: "Removed from saved universities" });
};
