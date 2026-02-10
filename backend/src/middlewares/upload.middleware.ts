// src/middlewares/upload.middleware.ts
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "src/uploads/"); // Make sure this folder exists
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

// Optional: filter by file type (e.g., only images)
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });
