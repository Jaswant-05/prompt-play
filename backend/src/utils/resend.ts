import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

export const sendVerificationEmail = async({ code, to } : { code: string; to: string }) => {
  if(!code) return {success : false};
  
  const verificationLink = `${process.env.FRONTEND_URL}/verify/?code=${code}`;
  
  const result = await resend.emails.send({
    from: 'Prompt Play <contact@mail.promptplay.co>',
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
    console.error(result.error)
    throw new Error('Error sending verification email');
  }

  return {
    success: true,
    data: result.data
  };
};

export const sendPasswordResetEmail = async({ code, to } : { code: string; to: string }) => {
  if(!code) return {success : false};
  
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${code}`;
  
  const result = await resend.emails.send({
    from: 'Prompt Play <contact@mail.promptplay.co>',
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
    throw new Error('Error sending password reset email');
  }

  return {
    success: true,
    data: result.data
  };
};

export const sendWelcomeEmail = async({ to, firstName } : { to: string; firstName?: string }) => {
  const displayName = firstName || 'there';
  
  const result = await resend.emails.send({
    from: 'Prompt Play <contact@mail.promptplay.co>',
    to,
    subject: 'Welcome to Prompt Play! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Welcome to Prompt Play, ${displayName}! 🎉</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Your email has been successfully verified! You're now ready to start your journey with Prompt Play.
          </p>
          <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #6c757d; text-align: left; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Explore our quiz categories</li>
              <li style="margin-bottom: 8px;">Challenge yourself with interactive prompts</li>
              <li style="margin-bottom: 8px;">Earn points and climb the leaderboard</li>
              <li style="margin-bottom: 8px;">Connect with the community</li>
            </ul>
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard"
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0;">
            Get Started
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Need help? Reply to this email or visit our support center.
          </p>
        </div>
      </div>
    `
  });

  if(result.error){
    throw new Error('Error sending welcome email');
  }

  return {
    success: true,
    data: result.data
  };
};

export const sendPasswordChangedNotification = async({ to, firstName } : { to: string; firstName?: string }) => {
  const displayName = firstName || 'there';
  
  const result = await resend.emails.send({
    from: 'Prompt Play <contact@mail.promptplay.co>',
    to,
    subject: 'Password Successfully Changed - Prompt Play',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Password Changed Successfully</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Hi ${displayName}, your Prompt Play account password has been successfully changed.
          </p>
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>✓ Your account is secure</strong><br>
            <small>Changed on: ${new Date().toLocaleString()}</small>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 30px;">
            If you didn't make this change, please contact our support team immediately.
          </p>
          <a href="${process.env.FRONTEND_URL}/signin"
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
            Sign In to Your Account
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you have any concerns, please contact us immediately at support@promptplay.co
          </p>
        </div>
      </div>
    `
  });

  if(result.error){
    throw new Error('Error sending password changed notification');
  }

  return {
    success: true,
    data: result.data
  };
};

export const sendAccountDeletionConfirmation = async({ code, to, firstName } : { code: string; to: string; firstName?: string }) => {
  if(!code) return {success : false};
  
  const displayName = firstName || 'there';
  const confirmLink = `${process.env.FRONTEND_URL}/confirm-deletion?code=${code}`;
  
  const result = await resend.emails.send({
    from: 'Prompt Play <contact@mail.promptplay.co>',
    to,
    subject: 'Confirm Account Deletion - Prompt Play',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #dc3545; margin-bottom: 20px;">⚠️ Account Deletion Request</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Hi ${displayName}, we received a request to delete your Prompt Play account. This action cannot be undone.
          </p>
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>⚠️ Warning:</strong> This will permanently delete:
            <ul style="text-align: left; margin-top: 10px;">
              <li>Your profile and account data</li>
              <li>All quiz scores and achievements</li>
              <li>Your points and leaderboard position</li>
            </ul>
          </div>
          <a href="${confirmLink}"
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0;">
            Confirm Account Deletion
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Or copy and paste this link in your browser:<br>
            <span style="word-break: break-all; color: #dc3545;">${confirmLink}</span>
          </p>
          <p style="color: #e74c3c; font-size: 14px; margin-top: 20px; font-weight: bold;">
            This link will expire in 24 hours for security reasons.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request account deletion, you can safely ignore this email. Your account will remain active.
          </p>
        </div>
      </div>
    `
  });

  if(result.error){
    throw new Error('Error sending account deletion confirmation email');
  }

  return {
    success: true,
    data: result.data
  };
};

export const sendCustomEmail = async({ 
  to, 
  subject, 
  htmlContent, 
  textContent 
} : { 
  to: string; 
  subject: string; 
  htmlContent: string; 
  textContent?: string; 
}) => {
  const result = await resend.emails.send({
    from: 'Prompt Play <contact@mail.promptplay.co>',
    to,
    subject,
    html: htmlContent,
    text: textContent
  });

  if(result.error){
    throw new Error('Error sending custom email');
  }

  return {
    success: true,
    data: result.data
  };
};