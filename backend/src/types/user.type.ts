import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: "user" | "admin";
  };
}

// Basic user info for requests (added by auth middleware)
export interface RequestUser {
  id: string;             // User ID from MongoDB
  role?: "user" | "admin";
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Input for updating user profile
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

// Input for registering a new user
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Login input
export interface LoginUserData {
  email: string;
  password: string;
}

// Saved university response
export interface SavedUniversity {
  _id: string;
  name: string;
  country: string;
  website?: string;
  [key: string]: any;
}
