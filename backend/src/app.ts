import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());


// Import routes
import authRouter from './routes/authRoute';




// Use routes
app.use('/api/auth', authRouter);
export default app;
