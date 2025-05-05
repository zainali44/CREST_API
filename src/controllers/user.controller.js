import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";
import {secretKey} from "../utils/generateRandomKey.js";
import Subscription from "../models/subscription.model.js";
import Plan from "../models/plan.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sendPasswordResetMail from "../utils/sendPasswordResetEmail.js";
import { Sequelize } from "sequelize";


// CREATE USER
export async function createUser (req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            emailToken: secretKey
        });

        // Send verification email
        await sendMail(email, secretKey);

        const userId = user.id;
        const planId = 1;
        const status = 'active';
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        const nextBillingDate = new Date(endDate);


        const newSubscription = await Subscription.create({
            user_id: userId,
            plan_id: planId,
            status: status,
            start_date: startDate,
            end_date: endDate,
            next_billing_date: nextBillingDate
        });

        res.status(201).json({
            message: "User  created successfully. Check your email to verify your account.",
            redirectUrl: "/",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// LOGIN USER
export async function loginUser (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User  not found" });
        }

        // Check if the user is verified
        if (!user.isVerifiedEmail) {
            return res.status(406).json({ error: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log('User  ID:', user.id, 'Type:', typeof user.id);

        const subscriptions = await Subscription.findAll({ where: { user_id: user.id } });

        if (subscriptions.length === 0) {
            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                token,
                subscriptions: []
            });
        }

        const plans = await Promise.all(subscriptions.map(async (subscription) => {
            try {
                const plan = await Plan.findOne({ where: { plan_id: subscription.plan_id } });
                console.log(`PLANS: ${plan}`);
                console.log(`SUBCRIPTION : ${subscription.plan_id}`);
                if (!plan) {
                    console.warn(`No plan found for subscription ID: ${subscription.subscription_id}`);
                    return { ...subscription.toJSON(), plan: null };
                }
                return { ...subscription.toJSON(), plan };
            } catch (error) {
                console.error(`Error fetching plan for subscription ID: ${subscription.subscription_id}`, error);
                return { ...subscription.toJSON(), plan: null };
            }
        }));

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            subscriptions: plans
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET USERS
export async function getUsers(req, res) {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// EMAIL VERIFICATION
export async function emailVerification(req,res){
    console.log(req.query.emailToken)

  const emailToken = req.query.emailToken;
  console.log(emailToken)
  if (!emailToken) {
    return res.redirect('http://localhost:3000/login?error=empty_request');
  }
  let user = await User.findOne({ where: { emailToken: emailToken } });

  if (!user) {
    return res.redirect('http://localhost:3000/login?error=user_not_found');
  }

  await User.update(
    { isVerifiedEmail: true, emailToken: null },
    { where: { emailToken: emailToken } }
  );
  await User.findOne({ where: { emailToken: emailToken } });
  return res
    .status(200)
    .json({ status: "Success", message: "User verified successfully",token:`${emailToken}` });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// UPDATE USER PROFILE (name and email)
export async function updateUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;
        
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // If email is being updated, verify it's not already in use
        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use' });
            }

            // Generate new email verification token
            const newEmailToken = secretKey;
            
            // Update user with new email and token
            await User.update(
                { 
                    name: name || user.name,
                    email,
                    isVerifiedEmail: false,
                    emailToken: newEmailToken 
                },
                { where: { id: userId } }
            );

            // Send verification email
            await sendMail(email, newEmailToken);
            
            return res.status(200).json({ 
                message: "Profile updated. Please verify your new email address." 
            });
        }
        
        // If only name is being updated
        await User.update(
            { name: name || user.name },
            { where: { id: userId } }
        );
        
        res.status(200).json({ 
            message: "Profile updated successfully.",
            user: {
                id: user.id,
                name: name || user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// UPDATE USER PASSWORD
export async function updateUserPassword(req, res) {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        
        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Get current date for password change
        const passwordChangedAt = new Date();
        
        // Update password with change timestamp
        await User.update(
            { 
                password: hashedPassword,
                passwordChangedAt: passwordChangedAt 
            },
            { where: { id: userId } }
        );
        
        res.status(200).json({ 
            message: "Password updated successfully",
            passwordChangedAt: passwordChangedAt
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// REQUEST PASSWORD RESET
export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Generate reset token
        const resetToken = secretKey;
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour
        
        // Save reset token to user
        await User.update(
            { 
                resetToken,
                resetTokenExpiry 
            },
            { where: { id: user.id } }
        );
        
        // Send password reset email
        await sendPasswordResetMail(email, resetToken);
        
        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// RESET PASSWORD WITH TOKEN
export async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }
        
        // Find user with valid token
        const user = await User.findOne({ 
            where: { 
                resetToken: token,
                resetTokenExpiry: { 
                    [Sequelize.Op.gt]: new Date() // Token not expired
                }
            } 
        });
        
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Get current date for password change
        const passwordChangedAt = new Date();
        
        // Update password and clear token
        await User.update(
            { 
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                passwordChangedAt: passwordChangedAt
            },
            { where: { id: user.id } }
        );
        
        res.status(200).json({ 
            message: "Password reset successfully",
            passwordChangedAt: passwordChangedAt
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// UPDATE USER PROFILE IMAGE
export async function updateUserImage(req, res) {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        
        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // If the user already has a profile image, delete it
        if (user.profileImage) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const oldImagePath = path.join(__dirname, '../../upload/profile', user.profileImage);
            
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        
        // Update user with new image filename
        await User.update(
            { profileImage: req.file.filename },
            { where: { id: userId } }
        );
        
        // Read the file and convert to base64
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const imagePath = path.join(__dirname, '../../upload/profile', req.file.filename);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = req.file.mimetype;
        const base64String = `data:${mimeType};base64,${base64Image}`;
        
        res.status(200).json({ 
            message: "Profile image updated successfully",
            profileImage: req.file.filename,
            imageBase64: base64String
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
