import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

dotenv.config();
connectDB();

const app: Application = express();

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://gigflow-dashboard-drab.vercel.app' 
  ],
  credentials: true
}));

app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'GigFlow API is running smoothly 🚀' });
});


app.use('/api/auth', authRoutes);

app.use('/api/leads', leadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});