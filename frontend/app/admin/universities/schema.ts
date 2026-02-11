import { z } from "zod";

export const universitySchema = z.object({
  name: z.string().min(2, "University name is required"),
  country: z.string().min(2, "Country is required"),
  courses: z.string().optional(),
  description: z.string().optional(),
});

export type UniversityFormInput = z.infer<typeof universitySchema>;

