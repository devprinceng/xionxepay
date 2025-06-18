import dotenv from 'dotenv';
import { connectDB } from './config/mongodb';
import app from './app';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
