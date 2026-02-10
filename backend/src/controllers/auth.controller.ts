import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDTO, LoginDTO } from "../dtos/user.dto";

const SECRET = "your_secret_key";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, confirmPassword, phoneNo }: RegisterDTO = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      phoneNo,
    });
    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: LoginDTO = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
