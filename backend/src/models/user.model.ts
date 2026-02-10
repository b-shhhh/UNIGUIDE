import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profilePic?: string;
  savedUniversities: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  savedUniversities: [{ type: Schema.Types.ObjectId, ref: "University" }]
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);
