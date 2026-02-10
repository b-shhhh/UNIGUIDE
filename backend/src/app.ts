import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './database/mongodb';

// Routescd..
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import universityRoutes from './routes/university.route';
import courseRoutes from './routes/course.route';

// Middlewares
import { errorMiddleware } from './middlewares/error.middleware';
import { HttpError } from './error/http-error';

dotenv.config();

// Initialize app
const app: Application = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));

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
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError('Route Not Found', 404));
});

// Error middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
