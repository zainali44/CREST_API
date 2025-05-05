import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetMail = async (email, resetToken) => {
    try {
        console.log("Sending password reset email");
        
        const { data, error } = await resend.emails.send({
            from: "noreply@thepassport-club.com",
            to: email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4CAF50; margin: 0;">Zettabyte</h1>
                    </div>
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                    <p>To reset your password, please click the button below:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${process.env.MAIN_URL}/reset-password?token=${resetToken}" 
                           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    <div style="padding: 15px; background-color: #f8f8f8; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <p><strong>Note:</strong> This link is valid for 1 hour from the time this email was sent.</p>
                    </div>
                    <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                    <p style="word-break: break-all; font-size: 12px;">${process.env.MAIN_URL}/reset-password?token=${resetToken}</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #777;">
                        <p>&copy; ${new Date().getFullYear()} Zettabyte. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error("Error sending password reset email:", error);
            throw new Error("Failed to send password reset email");
        }

        console.log('Password reset email sent successfully with ID:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error('Error in sendPasswordResetMail:', error);
        throw error;
    }
};

export default sendPasswordResetMail; 