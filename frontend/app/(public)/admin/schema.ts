import z from "zod";

export const adminCreateUserSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const adminUpdateUserSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone number is too short"),
  password: z.string().optional()
});

export type AdminCreateUserForm = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserForm = z.infer<typeof adminUpdateUserSchema>;
