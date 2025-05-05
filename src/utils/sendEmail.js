import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (email, emailToken) => {
    try {
        console.log("Sending email verification");
        
        const { data, error } = await resend.emails.send({
            from: "noreply@thepassport-club.com",
            to: email,
            subject: "Please Verify Your Email",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #3f51b5; margin: 0;">Zettabyte</h1>
                    </div>
                    <h2 style="color: #333; text-align: center;">Welcome to Zettabyte!</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering with Zettabyte. To complete your registration and verify your email address, please click the button below:</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${process.env.MAIN_URL}/users/verify-email?emailToken=${emailToken}" 
                           style="display: inline-block; padding: 12px 24px; background-color: #3f51b5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Verify Email Address
                        </a>
                    </div>
                    <div style="padding: 15px; background-color: #f8f8f8; border-left: 4px solid #3f51b5; margin: 20px 0;">
                        <p><strong>Note:</strong> This verification link will expire soon. Please verify your email as soon as possible.</p>
                    </div>
                    <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                    <p style="word-break: break-all; font-size: 12px;">${process.env.MAIN_URL}/users/verify-email?emailToken=${emailToken}</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #777;">
                        <p>&copy; ${new Date().getFullYear()} Zettabyte. All rights reserved.</p>
                        <p>If you did not sign up for a Zettabyte account, please disregard this email.</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error("Error sending verification email:", error);
            throw new Error("Failed to send verification email");
        }

        console.log('Email verification sent successfully with ID:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error('Error in sendMail:', error);
        throw error;
    }
};

export default sendMail;