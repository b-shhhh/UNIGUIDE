import { z } from "zod";

const registerBaseSchema = z.object({
  // Supports frontend payload (`username`) and legacy payload (`firstName`, `lastName`)
  username: z.string().min(2, "Username must be at least 2 characters").optional(),
  firstName: z.string().min(2, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email"),
  countryCode: z.string().regex(/^\+\d{1,3}$/, "Invalid country code").optional(),
  phone: z.string().min(7, "Phone number too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required").optional()
});

// Register input validation
export const registerSchema = registerBaseSchema
  .refine((data) => Boolean(data.username || data.firstName), {
    message: "Provide username or firstName",
    path: ["username"]
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Login input validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginInput = z.infer<typeof loginSchema>;
