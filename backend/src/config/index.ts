import dotenv from 'dotenv';
dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/university_guide';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret';
