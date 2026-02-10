import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { registerSchema, loginSchema } from "../dtos/user.dto";

// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod
    const parsed = registerSchema.parse(req.body);

    const { user, token } = await registerUser(parsed);

    // Return user data (without password) and token
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        },
        token
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod
    const parsed = loginSchema.parse(req.body);

    const { user, token } = await loginUser(parsed);

    // Return user data (without password) and token
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        },
        token
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
