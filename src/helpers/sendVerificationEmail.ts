import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log('Sending email to:', email);
    console.log('Verification code:', verifyCode);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    
    console.log('Email sent successfully to:', email);
    console.log('Resend response:', result);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email: ' + (emailError as Error).message };
  }
}