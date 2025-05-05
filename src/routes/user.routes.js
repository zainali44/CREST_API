import express from "express";
import { createUser, emailVerification, getUsers, loginUser, updateUserProfile, updateUserPassword, requestPasswordReset, resetPassword, updateUserImage } from "../controllers/user.controller.js";
import { authenticateToken } from "../middelware/authMiddleware.js";
import jwt from "jsonwebtoken";
import {getUserTransactions} from "../controllers/transaction.controller.js";
import {getLatestActiveSubscription} from "../controllers/subscription.controller.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import User from "../models/user.model.js";

const router = express.Router();

// Configure multer storage for profile images
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../upload/profile');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'profile-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max size
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
    }
});

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
 * /users/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/transactions/:id', getUserTransactions);

/**
 * @swagger
 * /users/active-plan/{id}:
 *   get:
 *     summary: Get an Active PLans by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Subscriptions ID
 *     responses:
 *       200:
 *         description: Subscriptions details
 *       404:
 *         description: Subscriptions not found
 */


router.get('/active-plan/:id', getLatestActiveSubscription);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', getUsers);

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

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Error updating profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/profile', authenticateToken, updateUserProfile);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Error updating password
 *       401:
 *         description: Unauthorized or incorrect current password
 *       404:
 *         description: User not found
 */
router.put('/password', authenticateToken, updateUserPassword);

/**
 * @swagger
 * /users/reset-password-request:
 *   post:
 *     summary: Request password reset
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
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Error sending reset email
 *       404:
 *         description: User not found
 */
router.post('/reset-password-request', requestPasswordReset);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password with token
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
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /users/profile-image:
 *   put:
 *     summary: Update user profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *       400:
 *         description: Error updating profile image
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/profile-image', authenticateToken, upload.single('profileImage'), updateUserImage);

export default router;