import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNo: string;
  profile_pic?: string;
  saved_universities: string[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    profile_pic: { type: String },
    saved_universities: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
