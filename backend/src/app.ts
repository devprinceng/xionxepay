import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';
import authRouter from './routes/authRoute';
import vendorRouter from './routes/vendorRoute';

dotenv.config();

// Connect Database
connectDB();

const allowedOrigins = [
  'http://localhost:3000'
];

const app = express();
app.use(express.json());

//handle cors
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
app.use('/api/vendor',vendorRouter);
export default app;