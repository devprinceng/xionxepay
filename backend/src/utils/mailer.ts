import transporter from "../config/nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

interface EmailTemplateOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}




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

const verifyEmailTemplate = (email: string, name: string, link: string): EmailTemplateOptions => ({
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



export default {
    sendRegistrationEmail,
    sendResetPasswordEmail,
};