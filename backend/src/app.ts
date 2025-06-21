import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';
dotenv.config();
// Import routes
import authRouter from './routes/authRoute';
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// Use routes
app.use('/api/auth', authRouter);
export default app;
