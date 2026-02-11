import { Request, Response } from "express";
import { University } from "../../models/university.model";

export const listUniversitiesAdmin = async (_req: Request, res: Response) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: universities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUniversityAdmin = async (req: Request, res: Response) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }
    res.status(200).json({ success: true, data: university });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUniversityAdmin = async (req: Request, res: Response) => {
  try {
    const { name, country, courses, description } = req.body;
    if (!name || !country) {
      return res.status(400).json({ success: false, message: "name and country are required" });
    }

    const courseList = Array.isArray(courses)
      ? courses.map((item) => String(item).trim()).filter(Boolean)
      : typeof courses === "string"
      ? courses.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const university = await University.create({
      name: String(name).trim(),
      country: String(country).trim(),
      courses: courseList,
      description: typeof description === "string" ? description.trim() : undefined,
    });

    res.status(201).json({ success: true, data: university });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUniversityAdmin = async (req: Request, res: Response) => {
  try {
    const updates: Record<string, unknown> = { ...req.body };
    if (typeof updates.courses === "string") {
      updates.courses = updates.courses
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    const university = await University.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }
    res.status(200).json({ success: true, data: university });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUniversityAdmin = async (req: Request, res: Response) => {
  try {
    const deleted = await University.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "University not found" });
    }
    res.status(200).json({ success: true, message: "University deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

