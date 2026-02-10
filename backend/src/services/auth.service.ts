import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config"; // import your secret
import { RegisterInput, LoginInput } from "../dtos/user.dto";

// Register user
export const registerUser = async (data: RegisterInput) => {
  const { firstName, lastName, email, phone, password } = data;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
};

// Login user
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  // Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
};
