import transporter from "../config/nodemailer";
// import dotenv from "dotenv";
// dotenv.config();
import { EmailTemplateOptions } from "../interfaces/email.interface";




const resetPasswordMail = (email: string, name: string, resetPasswordLink: string): EmailTemplateOptions => ({
    from: process.env.EMAIL_FROM || '',
    to: email,
    subject: `Reset your password for ${process.env.APP_NAME}`,
    text: `Hello ${name},\n\nWe received a request to reset your password for your account.\n\nPlease click the link below to reset your password:\n${resetPasswordLink}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\n${process.env.APP_NAME}`,
    html: `<!DOCTYPE html>
<html>
  <body style="background-color:hsl(222.2, 84%, 4.9%); color:hsl(210, 40%, 98%); font-family:sans-serif; padding: 2rem;">
    <div style="max-width:600px; margin:auto; background:hsl(222.2, 84%, 4.9%); border-radius:8px; padding:2rem;">
      <h1 style="color:hsl(217.2, 91.2%, 59.8%)">Reset Your Password</h1>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <a href="${resetPasswordLink}" style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background-color:hsl(217.2, 91.2%, 59.8%); color:hsl(222.2, 84%, 4.9%); text-decoration:none; border-radius:4px;">Reset Password</a>
      <p style="margin-top:1.5rem;">If you didn’t request a password reset, no further action is needed.</p>
      <p style="margin-top:2rem; font-size:0.85rem; color:hsl(215, 20.2%, 65.1%)">This link will expire in 1 hour for your security.</p>
    </div>
  </body>
</html>`,    
});


const welcomeMail = (email: string, name: string, verifyEmailLink: string): EmailTemplateOptions => ({
    from: process.env.EMAIL_FROM || '',
    to: email,
    subject: `Welcome to ${process.env.APP_NAME}`,
    text: `Hello ${name},\n\nThank you for signing up! We're excited to have you on board. Get ready to explore all the features we have to offer.\n\nNeed help getting started? Visit our help center or reach out to our support team.\n\nBest regards,\n${process.env.APP_NAME}`,
    html: `<html>
  <body style="background-color:hsl(222.2, 84%, 4.9%); color:hsl(210, 40%, 98%); font-family:sans-serif; padding: 2rem;">
    <div style="max-width:600px; margin:auto; background:hsl(222.2, 84%, 4.9%); border-radius:8px; padding:2rem;">
      <h1 style="color:hsl(217.2, 91.2%, 59.8%)">Welcome to Our Platform!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for signing up! We're excited to have you on board. Get ready to explore all the features we have to offer.</p>
      <p>Need help getting started? Visit our help center or reach out to our support team.</p>
      <a href="${verifyEmailLink}" style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background-color:hsl(217.2, 91.2%, 59.8%); color:hsl(222.2, 84%, 4.9%); text-decoration:none; border-radius:4px;">Verify Email</a>
      <p style="margin-top:2rem; font-size:0.85rem; color:hsl(215, 20.2%, 65.1%)">You're receiving this email because you created an account with us.</p>
    </div>
  </body>
</html>`,
});

const verifyEmailTemplate = (email: string, name: string, link: string,): EmailTemplateOptions => ({
    from: process.env.EMAIL_FROM || '',
    to: email,
    subject: `Verify your email for ${process.env.APP_NAME}`,
    text: `Hello ${name},\n\nPlease verify your email address by clicking the link below.\n\nBest regards,\n${process.env.APP_NAME}`,
    html: `<html>
  <body style="background-color:hsl(222.2, 84%, 4.9%); color:hsl(210, 40%, 98%); font-family:sans-serif; padding: 2rem;">
    <div style="max-width:600px; margin:auto; background:hsl(222.2, 84%, 4.9%); border-radius:8px; padding:2rem;">
      <h1 style="color:hsl(217.2, 91.2%, 59.8%)">Verify Your Email</h1>
      <p>Hello ${name},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${link}" style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background-color:hsl(217.2, 91.2%, 59.8%); color:hsl(222.2, 84%, 4.9%); text-decoration:none; border-radius:4px;">Verify Email</a>
      <p style="margin-top:2rem; font-size:0.85rem; color:hsl(215, 20.2%, 65.1%)">If you did not create an account, you can ignore this email.</p>
    </div>
  </body>
</html>`,
});

const paymentSuccessEmailTemplate = (email:string,txHash:string,productName:string, amount:string):EmailTemplateOptions =>({
  from:process.env.EMAIL_FROM || '',
  to:email,
  subject:`Payment Success for ${process.env.APP_NAME}`,
  text:`Hello,\n\nYour payment of ${amount} was successful. Your transaction hash is ${txHash}.\n\nBest regards,\n${process.env.APP_NAME}`,
  html:`
<<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice - Payment Received</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #0f172a;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #f1f5f9;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #1e293b;
        padding: 30px;
        border-radius: 8px;
      }
      h1 {
        color: #22c55e;
        font-size: 24px;
      }
      p {
        line-height: 1.6;
        font-size: 16px;
      }
      .details {
        background-color: #334155;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
        color: #f8fafc;
        font-size: 15px;
      }
      .details strong {
        color: #38bdf8;
      }
      .button {
        display: inline-block;
        background-color: #3b82f6;
        color: #0f172a;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #94a3b8;
        text-align: center;
      }
      code {
        background-color: #0f172a;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 13px;
        display: inline-block;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>✅ Payment Received</h1>
      <p>
        Hello,<br />
        We’ve received your payment of <strong>$${amount}</strong> for the product:
        <strong>${productName}</strong>.
      </p>

      <div class="details">
        <p><strong>Status:</strong> Completed</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Transaction Hash:</strong><br /><code>${txHash}</code></p>
      </div>

      <a class="button" href="https://explorer.burnt.com/txs/${txHash}" target="_blank">
        🔍 View on Explorer
      </a>

      <p style="margin-top: 30px;">
        You can keep this invoice for your records.<br />
        Thank you for using our service.
      </p>

      <div class="footer">
        &copy; ${new Date().getFullYear()} ${process.env.APP_NAME || "YourApp"} • Powered by Xion Protocol
      </div>
    </div>
  </body>
</html>
  `,
});

const paymentTimeoutEmailTemplate = (email:string, expectedAmount: string, sessionId: string): EmailTemplateOptions => ({
    from: process.env.EMAIL_FROM || '',
    to: email,
    subject: `Payment Timeout for Session ${sessionId}`,
    text: `Hello,\n\nYour payment session with ID ${sessionId} has timed out. The expected amount was ${expectedAmount}.\n\nPlease initiate a new payment session if you wish to proceed.\n\nBest regards,\n${process.env.APP_NAME}`,
    html: `<html>
  <body style="background-color:hsl(222.2, 84%, 4.9%); color:hsl(210, 40%, 98%); font-family:sans-serif; padding: 2rem;">
    <div style="max-width:600px; margin:auto; background:hsl(222.2, 84%, 4.9%); border-radius:8px; padding:2rem;">
      <h1 style="color:hsl(217.2, 91.2%, 59.8%)">Payment Timeout</h1>
      <p>Hello,</p>
      <p>Your payment session with ID <strong>${sessionId}</strong> has timed out. The expected amount was <strong>${expectedAmount}</strong>.</p>
      <p>Please initiate a new payment session if you wish to proceed.</p>
      <p style="margin-top:2rem; font-size:0.85rem; color:hsl(215, 20.2%, 65.1%)">If you have any questions, feel free to contact our support team.</p>
    </div>
  </body>
</html>`,
})

export const sendVerificationEmail = async (email: string, name: string, verifyEmailLink: string): Promise<EmailTemplateOptions> => {
    const mail = verifyEmailTemplate(email, name, verifyEmailLink);
    await transporter.sendMail(mail);
    return mail;
};

export const sendRegistrationEmail = async (email: string, name: string, verifyEmailLink: string): Promise<EmailTemplateOptions> => {
     const mail = welcomeMail(email, name, verifyEmailLink);
     await transporter.sendMail(mail);
     return mail;
};

export const sendResetPasswordEmail = async (email: string, name: string, resetPasswordLink: string): Promise<EmailTemplateOptions> => {
    const mail = resetPasswordMail(email, name, resetPasswordLink);
    await transporter.sendMail(mail);
    return mail;
};




export const paymentSuccessEmail = async (email:string,amount: string, txHash: string, productName: string): Promise<EmailTemplateOptions> => {
  const mail = paymentSuccessEmailTemplate(email,txHash,productName,amount);
  await transporter.sendMail(mail);
  return mail;
}


export const paymentTimeoutEmail = async (email:string, expectedAmount: string, sessionId: string): Promise<EmailTemplateOptions> => {
  const mail = paymentTimeoutEmailTemplate(email, expectedAmount, sessionId);
  await transporter.sendMail(mail);
  return mail;
};





export default {
    sendRegistrationEmail,
    sendResetPasswordEmail,
};