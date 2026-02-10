import { Schema, model, Document } from "mongoose";

export interface IUniversity extends Document {
  name: string;
  country: string;
  courses: string[];
  description?: string;
  image?: string;
}

const universitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    courses: { type: [String], required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default model<IUniversity>("University", universitySchema);
