import { Request, Response } from "express";
import { Country } from "../../models/country.model";

export const listCountriesAdmin = async (_req: Request, res: Response) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: countries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCountryAdmin = async (req: Request, res: Response) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.status(200).json({ success: true, data: country });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCountryAdmin = async (req: Request, res: Response) => {
  try {
    const { name, flagUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }
    const country = await Country.create({
      name: String(name).trim(),
      flagUrl: typeof flagUrl === "string" ? flagUrl.trim() : undefined,
    });
    res.status(201).json({ success: true, data: country });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCountryAdmin = async (req: Request, res: Response) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.status(200).json({ success: true, data: country });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCountryAdmin = async (req: Request, res: Response) => {
  try {
    const deleted = await Country.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.status(200).json({ success: true, message: "Country deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

