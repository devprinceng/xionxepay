import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';
// Import routes
import authRouter from './routes/authRoute';
// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000'
];
// Load environment variables   
dotenv.config();
// Connect to the database
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
}));







// Use routes
app.use('/api/auth', authRouter);
export default app;
