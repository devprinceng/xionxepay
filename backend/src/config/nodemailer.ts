import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export default transporter;
