import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import cors from 'cors';
import authRouter from './routes/authRoute';
import vendorRouter from './routes/vendorRoute';
import productRouter from './routes/productRoute';
import cookieParser from 'cookie-parser';

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


app.use(cookieParser());
app.use(express.json());

// Use routes
app.use('/api/auth', authRouter);

app.use('/api/vendor',vendorRouter);

app.use('/api/product', productRouter);

app.use('/api/payment', require('./routes/paymentRoute'));
app.use('/api/payment-sessions', require('./routes/paymentSessionRoute'));

export default app;
