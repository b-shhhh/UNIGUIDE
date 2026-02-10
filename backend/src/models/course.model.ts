import { Schema, model, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  countries: string[];
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  countries: { type: [String], required: true },
});

export default model<ICourse>("Course", courseSchema);
