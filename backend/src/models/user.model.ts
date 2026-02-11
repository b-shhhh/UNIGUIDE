import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  bio?: string;
  password: string;
  role: "user" | "admin";
  profilePic?: string;
  savedUniversities: mongoose.Types.ObjectId[];
   resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String },
  bio: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePic: { type: String },
  savedUniversities: [{ type: Schema.Types.ObjectId, ref: "University" }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);
