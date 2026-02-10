import mongoose, { Schema, Document } from "mongoose";

export interface IUniversity extends Document {
  name: string;
  country: string;
  courses: string[]; // List of course names
  description?: string;
 
}

const universitySchema = new Schema<IUniversity>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  courses: [{ type: String }],
  description: { type: String },
  
}, { timestamps: true });

export const University = mongoose.model<IUniversity>("University", universitySchema);
