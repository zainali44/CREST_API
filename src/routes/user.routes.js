import express from "express";
import { createUser, emailVerification, loginUser } from "../controllers/user.controller.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import User from "../models/user.model.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Error creating user
 */
router.post('/create', createUser );

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', loginUser );

/**
 * @swagger
 * /users/validate-token:
 *   post:
 *     summary: Validate a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Token is required
 *       401:
 *         description: Invalid token
 */
router.post('/validate-token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valid: false, message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        
        try {
            // Get user data
            const user = await User.findByPk(decoded.id, {
                attributes: ['id', 'name', 'email', 'isVerifiedEmail', 'profileImage', 'passwordChangedAt']
            });
            
            if (!user) {
                return res.status(404).json({ valid: false, message: 'User not found' });
            }
            
            // Convert profile image to base64 if it exists
            let imageBase64 = null;
            if (user.profileImage) {
                const __dirname = path.dirname(fileURLToPath(import.meta.url));
                const imagePath = path.join(__dirname, '../../upload/profile', user.profileImage);
                
                if (fs.existsSync(imagePath)) {
                    // Get file extension and determine mime type
                    const ext = path.extname(user.profileImage).toLowerCase();
                    let mimeType = 'image/jpeg'; // default
                    
                    if (ext === '.png') mimeType = 'image/png';
                    else if (ext === '.gif') mimeType = 'image/gif';
                    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
                    
                    const imageBuffer = fs.readFileSync(imagePath);
                    const base64Image = imageBuffer.toString('base64');
                    imageBase64 = `data:${mimeType};base64,${base64Image}`;
                }
            }
            
            return res.status(200).json({ 
                valid: true, 
                message: 'Token is valid',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerifiedEmail,
                    profileImage: user.profileImage,
                    imageBase64: imageBase64,
                    passwordChangedAt: user.passwordChangedAt
                }
            });
        } catch (error) {
            return res.status(500).json({ valid: false, message: 'Server error', error: error.message });
        }
    });
});

/**
 * @swagger
 * /users/verify-email:
 *   get:
 *     summary: Verify user email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The token sent to the user's email for verification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verification successful
 *       400:
 *         description: Invalid or missing token
 *       404:
 *         description: User not found
 */
router.get("/verify-email", emailVerification);

export default router;