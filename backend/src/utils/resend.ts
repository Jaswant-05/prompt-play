import { Resend } from 'resend';
import dotenv from "dotenv"
dotenv.config();

const resend = new Resend(process.env.RESEND_kEY);

export const sendVerificationEmail = async({ code, to } : { code: string; to: string }) => {
  if(!code) return {success : false};
  
  const verificationLink = `${process.env.FRONTEND_URL}/verify/?code=${code}`;
  
  const result = await resend.emails.send({
    from: 'mail.promptplay.co',
    to,
    subject: 'Prompt Play Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Welcome to Prompt Play!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Thank you for signing up. Please verify your email address to complete your registration.
          </p>
          <a href="${verificationLink}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
            Verify Email Address
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Or copy and paste this link in your browser:<br>
            <span style="word-break: break-all; color: #007bff;">${verificationLink}</span>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `
  });

  if(result.error){
    throw new Error('Error sending verification email')
  }

  return ({
    success : true,
    data : result.data
  })
}

export const sendPasswordResetEmail = async({ code, to } : { code: string; to: string }) => {
  if(!code) return {success : false};
  
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${code}`;
  
  const result = await resend.emails.send({
    from: 'mail.promptplay.co',
    to,
    subject: 'Prompt Play Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            We received a request to reset your password for your Prompt Play account. Click the button below to create a new password.
          </p>
          <a href="${resetLink}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Or copy and paste this link in your browser:<br>
            <span style="word-break: break-all; color: #dc3545;">${resetLink}</span>
          </p>
          <p style="color: #e74c3c; font-size: 14px; margin-top: 20px; font-weight: bold;">
            This link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
      </div>
    `
  });

  if(result.error){
    throw new Error('Error sending password reset email')
  }

  return ({
    success : true,
    data : result.data
  })
}
