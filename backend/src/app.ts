// src/app.ts
import express, { Application } from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from 'cors';
import path from 'path';

import { connectDatabase } from './database/mongodb';

// Routes
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import universityRoutes from './routes/university.route';
import courseRoutes from './routes/course.route';

// Middlewares
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app: Application = express();

// CORS options
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3003"], // your frontend URLs
};
app.use(cors(corsOptions));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDatabase()
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/courses', courseRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Error middleware
app.use(errorMiddleware);

export default app;
