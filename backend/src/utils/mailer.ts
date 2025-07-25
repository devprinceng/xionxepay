import transporter from "../config/nodemailer";
// import dotenv from "dotenv";
// dotenv.config();
import { EmailTemplateOptions } from "../interfaces/email.interface";




const resetPasswordMail = (
  email: string,
  name: string,
  resetPasswordLink: string
): EmailTemplateOptions => ({
  from: process.env.EMAIL_FROM || '',
  to: email,
  subject: `Reset your password | ${process.env.APP_NAME}`,
  text: `Hi ${name},

We received a request to reset your password for your account on ${process.env.APP_NAME}.

Please click the link below to reset your password:
${resetPasswordLink}

If you did not request this, please ignore this email.

Best regards,
${process.env.APP_NAME}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password | ${process.env.APP_NAME}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    a:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body style="background-color:#0f172a; margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#f1f5f9;">

  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#0f172a;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Reset your password request on ${process.env.APP_NAME}
  </div>

  <!-- Email wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding: 2rem;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color:#1e293b; border-radius:12px; padding:2rem;">

          <!-- Logo -->
          <tr>
            <td style="text-align: center; padding-bottom: 1.5rem;">
              <img src="https://yourdomain.com/logo.png" alt="${process.env.APP_NAME} Logo" height="40" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td>
              <h1 style="font-size: 24px; color:#3b82f6; margin:0 0 1rem;">Reset your password</h1>
              <p style="font-size: 16px; margin-bottom: 1rem;">Hi ${name},</p>
              <p style="font-size: 15px; margin-bottom: 2rem;">You recently requested to reset your password. Click the button below to choose a new one:</p>

              <!-- Reset Button -->
              <div style="text-align: center;">
                <a href="${resetPasswordLink}" style="background-color:#3b82f6; color:#0f172a; padding:0.75rem 1.5rem; border-radius:6px; text-decoration:none; font-weight:600; display:inline-block;">Reset Password</a>
              </div>

              <!-- Fallback link -->
              <p style="font-size: 14px; margin-top:2rem;">Or copy and paste this link into your browser:</p>
              <p style="word-break:break-word;"><a href="${resetPasswordLink}" style="color:#60a5fa;">${resetPasswordLink}</a></p>

              <p style="font-size: 13px; color:#94a3b8; margin-top:2rem;">
                This link is valid for 1 hour. If you didn’t request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding-top: 2rem; font-size: 12px; color: #64748b;">
              <hr style="border:none; border-top:1px solid #334155; margin:2rem 0;" />
              <p>Need help? <a href="mailto:${process.env.EMAIL_FROM}" style="color:#60a5fa;">Contact Support</a></p>
              <p>You’re receiving this email because you’re a registered user of ${process.env.APP_NAME}.</p>
              <p style="margin-top:1rem; color:#475569;">
          &copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.<br/>
          🚀 Powered by <a href="https://xion.burnt.com" style="color:#60a5fa; text-decoration:none;">Xion Protocol</a>
        </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
});




const welcomeMail = (
  email: string,
  name: string,
  verifyEmailLink: string
): EmailTemplateOptions => ({
  from: process.env.EMAIL_FROM || '',
  to: email,
  subject: `Welcome to ${process.env.APP_NAME}!`,
  text: `Hi ${name},

Thank you for signing up for ${process.env.APP_NAME}. We're thrilled to have you on board!

Please confirm your email address by visiting the link below:
${verifyEmailLink}

If you didn’t sign up, just ignore this email.

Best,
The ${process.env.APP_NAME} Team`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to ${process.env.APP_NAME}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f172a; color:#f1f5f9; font-family:Arial, sans-serif;">
    <!-- Preheader -->
    <span style="display:none; font-size:0; line-height:0; max-height:0; opacity:0;">
      Welcome to ${process.env.APP_NAME} – Let’s get started.
    </span>

    <div style="max-width:600px; margin:0 auto; padding:2rem;">
      <!-- Header -->
      <div style="text-align:center; margin-bottom:1.5rem;">
        <img src="https://yourdomain.com/logo.png" alt="${process.env.APP_NAME} Logo" style="height:40px;" />
      </div>

      <!-- Hero Image -->
      <img src="https://yourdomain.com/assets/welcome-hero.png" alt="Welcome" style="width:100%; border-radius:6px; margin-bottom:1.5rem;" />

      <!-- Welcome Card -->
      <div style="background-color:#1e293b; padding:2rem; border-radius:8px;">
        <h1 style="color:#3b82f6; font-size:24px;">Welcome to ${process.env.APP_NAME}, ${name}!</h1>
        <p style="font-size:16px; margin:1rem 0;">
          We're thrilled to have you here. Start exploring all the features we’ve built for you.
        </p>

        <!-- Tagline -->
        <p style="font-size:15px; font-style:italic; color:#94a3b8; margin:1rem 0;">
          "Empowering Merchants with Web3 Power."
        </p>


        <p style="font-size:15px; color:#cbd5e1;">
          To get started, please verify your email address:
        </p>

        <!-- Verify Button -->
        <a href="${verifyEmailLink}"
           style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background-color:#3b82f6; color:#0f172a; text-decoration:none; font-weight:bold; border-radius:6px;">
          Verify Email
        </a>

        <!-- Microcopy -->
        <p style="font-size:12px; color:#64748b; margin-top:0.5rem;">
          Takes less than 10 seconds. No spam, ever.
        </p>

        <!-- Fallback URL -->
        <p style="font-size:13px; margin-top:2rem;">
          Or copy and paste this link into your browser:<br/>
          <a href="${verifyEmailLink}" style="color:#60a5fa;">${verifyEmailLink}</a>
        </p>
      </div>

      <!-- Social Links -->
<div style="text-align:center; margin-top:2rem;">
  <a href="#" target="_blank" rel="noopener noreferrer" style="margin-right:10px;">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/twitter.svg" alt="Twitter" height="20" />
  </a>
  <a href="#" target="_blank" rel="noopener noreferrer" style="margin-right:10px;">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/discord.svg" alt="Discord" height="20" />
  </a>
  <a href="#" target="_blank" rel="noopener noreferrer" style="margin-right:10px;">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg" alt="Facebook" height="20" />
  </a>
  <a href="#" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" height="20" />
  </a>
</div>


      <!-- Footer -->
      <div style="text-align:center; margin-top:2rem; font-size:12px; color:#64748b;">
        <hr style="border:none; border-top:1px solid #334155; margin:2rem 0;" />
        <p>You’re receiving this email because you created an account on ${process.env.APP_NAME}.</p>
        <p>💬 Need help? <a href="${process.env.EMAIL_FROM}" style="color:#60a5fa;">${process.env.EMAIL_FROM}</a></p>
        <p style="margin-top:1rem; color:#475569;">
          &copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.<br/>
          🚀 Powered by <a href="https://xion.burnt.com" style="color:#60a5fa; text-decoration:none;">Xion Protocol</a>
        </p>
      </div>
    </div>
  </body>
</html>`,
});


const verifyEmailTemplate = (
  email: string,
  name: string,
  link: string
): EmailTemplateOptions => ({
  from: process.env.EMAIL_FROM || '',
  to: email,
  subject: `Verify your email for ${process.env.APP_NAME}`,
  text: `Hello ${name},\n\nThank you for signing up for ${process.env.APP_NAME}! Please verify your email address by clicking the link below:\n\n${link}\n\nIf you did not create an account, you can safely ignore this email.\n\nBest regards,\n${process.env.APP_NAME} Team`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Email</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f172a; font-family:Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#0f172a; padding: 2rem 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color:#1e293b; border-radius:8px; overflow:hidden;">
            <!-- Logo Header -->
            <tr>
              <td align="center" style="padding: 2rem;">
                <img src="https://yourdomain.com/logo.png" alt="${process.env.APP_NAME} Logo" width="120" style="display:block; margin:auto;" />
              </td>
            </tr>
            <!-- Body Content -->
            <tr>
              <td style="padding: 2rem; color: #f1f5f9;">
                <h2 style="color: #3b82f6; margin-bottom: 1rem;">Verify Your Email</h2>
                <p style="font-size: 16px; line-height: 1.5;">Hello ${name},</p>
                <p style="font-size: 16px; line-height: 1.5;">Thank you for joining <strong>${process.env.APP_NAME}</strong>! To complete your registration, please verify your email by clicking the button below.</p>
                <p style="text-align: center; margin: 2rem 0;">
                  <a href="${link}" style="background-color: #3b82f6; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email</a>
                </p>
                <p style="font-size: 14px; color: #94a3b8;">If you did not create this account, you can safely ignore this email.</p>
                <p style="font-size: 14px; color: #94a3b8;">Need help? Contact our support team anytime.</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#0f172a; text-align:center; padding: 1rem; color: #64748b; font-size: 13px;">
                <hr style="border:none; border-top:1px solid #334155; margin:2rem 0;" />
                <a href="mailto:support@yourdomain.com" style="color: #3b82f6; text-decoration: none;">support@yourdomain.com</a>
                <p style="margin-top:1rem; color:#475569;">
          &copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.<br/>
          🚀 Powered by <a href="https://xion.burnt.com" style="color:#60a5fa; text-decoration:none;">Xion Protocol</a>
        </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
});


const paymentSuccessEmailTemplate = (
  email: string,
  txHash: string,
  productName: string,
  amount: string
): EmailTemplateOptions => ({
  from: process.env.EMAIL_FROM || '',
  to: email === "" ? process.env.EMAIL_FROM || "" : email,
  subject: `Payment Success for ${process.env.APP_NAME}`,
  text: `Hello,

We’ve received your payment of ${amount} for ${productName}.
Transaction Hash: ${txHash}

Thank you for using ${process.env.APP_NAME}.
Powered by Xion Protocol.`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Payment Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f172a; color:#f1f5f9; font-family:Arial, sans-serif;">
    <!-- Preheader -->
    <span style="display:none; font-size:0; line-height:0; max-height:0; opacity:0;">
      Your payment for ${productName} was received successfully.
    </span>

    <div style="max-width:600px; margin:0 auto; padding:2rem;">
      <!-- Header -->
      <div style="text-align:center; margin-bottom:1.5rem;">
        <img src="https://yourdomain.com/logo.png" alt="${process.env.APP_NAME} Logo" style="height:40px;" />
      </div>

      <!-- Payment Card -->
      <div style="background-color:#1e293b; padding:2rem; border-radius:8px;">
        <h1 style="color:#10b981; font-size:22px;">✅ Payment Received</h1>
        <p style="font-size:16px; margin:1rem 0;">
          Hello,<br />
          We’ve successfully received your payment of <strong>$${amount}</strong> for the product:
          <strong>${productName}</strong>.
        </p>

        <div style="margin-top:1rem; font-size:15px;">
          <p><strong>Status:</strong> Completed</p>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Transaction Hash:</strong><br /><code style="color:#60a5fa;">${txHash}</code></p>
        </div>

        <!-- Explorer Button -->
        <a href="https://explorer.burnt.com/txs/${txHash}"
           target="_blank"
           style="display:inline-block; margin-top:1.5rem; padding:0.75rem 1.5rem; background-color:#3b82f6; color:#0f172a; text-decoration:none; font-weight:bold; border-radius:6px;">
          🔍 View on Explorer
        </a>

        <!-- Notes -->
        <p style="margin-top:2rem; font-size:14px; color:#cbd5e1;">
          You can keep this email as your invoice and proof of payment.<br />
          Thank you for trusting ${process.env.APP_NAME}.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align:center; margin-top:2rem; font-size:12px; color:#64748b;">
        <hr style="border:none; border-top:1px solid #334155; margin:2rem 0;" />
        <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || "YourApp"} • Powered by <a href="https://docs.burnt.com/xion" style="color:#60a5fa;">Xion Protocol</a></p>
      </div>
    </div>
  </body>
</html>`
});

const paymentSuccessEmailTemplateVendor = (
  email: string,
  txHash: string,
  productName: string,
  amount: string,
  vendorBusinessName: string,
  vendorBusinessLogo: string
): EmailTemplateOptions => ({
  from: process.env.EMAIL_FROM || '',
  to: email,
  subject: `Payment Success for ${process.env.APP_NAME}`,
  text: `Hello, ${vendorBusinessName},

You’ve received a payment of ${amount} for ${productName}.
Transaction Hash: ${txHash}

Thank you for using ${process.env.APP_NAME}.
Powered by Xion Protocol.`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Payment Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background-color:#0f172a; color:#f1f5f9; font-family:Arial, sans-serif;">
    <!-- Preheader -->
    <span style="display:none; font-size:0; line-height:0; max-height:0; opacity:0;">
      Payment for ${productName} was received successfully.
    </span>

    <div style="max-width:600px; margin:0 auto; padding:2rem;">
      <!-- Header -->
      <div style="text-align:center; margin-bottom:1.5rem;">
        <img src="${vendorBusinessLogo}" alt="${process.env.APP_NAME} Logo" style="height:40px;" />
      </div>

      <!-- Payment Card -->
      <div style="background-color:#1e293b; padding:2rem; border-radius:8px;">
        <h1 style="color:#10b981; font-size:22px;">✅ Payment Received</h1>
        <p style="font-size:16px; margin:1rem 0;">
          Hello, ${vendorBusinessName}<br />
          You’ve successfully received payment of <strong>$${amount}</strong> for the product:
          <strong>${productName}</strong>.
        </p>

        <div style="margin-top:1rem; font-size:15px;">
          <p><strong>Status:</strong> Completed</p>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Transaction Hash:</strong><br /><code style="color:#60a5fa;">${txHash}</code></p>
        </div>

        <!-- Explorer Button -->
        <a href="https://explorer.burnt.com/txs/${txHash}"
           target="_blank"
           style="display:inline-block; margin-top:1.5rem; padding:0.75rem 1.5rem; background-color:#3b82f6; color:#0f172a; text-decoration:none; font-weight:bold; border-radius:6px;">
          🔍 View on Explorer
        </a>

        <!-- Notes -->
        <p style="margin-top:2rem; font-size:14px; color:#cbd5e1;">
          You can keep this email as your invoice and proof of payment.<br />
          Thank you for trusting ${process.env.APP_NAME}.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align:center; margin-top:2rem; font-size:12px; color:#64748b;">
        <hr style="border:none; border-top:1px solid #334155; margin:2rem 0;" />
        <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || "YourApp"} • Powered by <a href="https://docs.burnt.com/xion" style="color:#60a5fa;">Xion Protocol</a></p>
      </div>
    </div>
  </body>
</html>`
});


const paymentTimeoutEmailTemplate = (
  email: string,
  expectedAmount: string,
  sessionId: string
): EmailTemplateOptions => ({
  from: process.env.EMAIL_FROM || '',
  to: email,
  subject: `Payment Timeout for Session ${sessionId}`,
  text: `Hello,

Your payment session with ID ${sessionId} has timed out. The expected amount was ${expectedAmount}.

Please initiate a new payment session if you wish to proceed.

Best regards,
${process.env.APP_NAME}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Timeout - ${process.env.APP_NAME}</title>
</head>
<body style="margin:0; padding:0; background-color:#0f172a; color:#f1f5f9; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:2rem;">
    <!-- Header -->
    <div style="text-align:center; margin-bottom:1.5rem;">
      <img src="https://yourdomain.com/logo.png" alt="${process.env.APP_NAME} Logo" style="height:40px;" />
    </div>

    <!-- Card -->
    <div style="background-color:#1e293b; padding:2rem; border-radius:8px;">
      <h1 style="color:#f87171; font-size:24px;">Payment Session Timed Out</h1>
      <p style="font-size:16px;">
        Hello,
      </p>
      <p style="font-size:15px; margin:1rem 0;">
        Your payment session with ID <strong>${sessionId}</strong> has timed out.
        The expected amount was <strong>${expectedAmount}</strong>.
      </p>
      <p style="font-size:14px; color:#cbd5e1;">
        Please initiate a new payment session if you wish to continue.
      </p>

      <a href="${process.env.APP_URL || '#'}" 
         style="display:inline-block; margin-top:1.5rem; padding:0.75rem 1.5rem; background-color:#3b82f6; color:#0f172a; text-decoration:none; font-weight:bold; border-radius:6px;">
        Start New Payment
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center; margin-top:2rem; font-size:12px; color:#64748b;">
      <hr style="border:none; border-top:1px solid #334155; margin:2rem 0;" />
      <p>You’re receiving this email from ${process.env.APP_NAME} because a payment session was initiated with your email address.</p>
      <p>Need help? <a href="mailto:support@yourdomain.com" style="color:#60a5fa;">Contact Support</a></p>
      <p style="margin-top:1rem;">&copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. Powered by <a href="https://xion.burnt.com" style="color:#60a5fa;">Xion Protocol</a>.</p>
    </div>
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




export const paymentSuccessEmail = async (email:string,amount: string, txHash: string, productName: string): Promise<EmailTemplateOptions> => {
  const mail = paymentSuccessEmailTemplate(email,txHash,productName,amount);
  await transporter.sendMail(mail);
  return mail;
}
export const paymentSuccessEmailVendor = async (email:string,amount: string, txHash: string, productName: string,vendorBusinessName: string,vendorBusinessLogo: string): Promise<EmailTemplateOptions> => {
  const mail = paymentSuccessEmailTemplateVendor(email,txHash,productName,amount,vendorBusinessLogo, vendorBusinessName);
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