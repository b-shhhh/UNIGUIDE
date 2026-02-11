import { Request, Response } from "express";
import { Course } from "../../models/course.model";

export const listCoursesAdmin = async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseAdmin = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourseAdmin = async (req: Request, res: Response) => {
  try {
    const { name, countries, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    const countryList = Array.isArray(countries)
      ? countries.map((item) => String(item).trim()).filter(Boolean)
      : typeof countries === "string"
      ? countries.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const course = await Course.create({
      name: String(name).trim(),
      countries: countryList,
      description: typeof description === "string" ? description.trim() : undefined,
    });
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourseAdmin = async (req: Request, res: Response) => {
  try {
    const updates: Record<string, unknown> = { ...req.body };
    if (typeof updates.countries === "string") {
      updates.countries = updates.countries
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourseAdmin = async (req: Request, res: Response) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

