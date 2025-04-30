import express from "express";
import { createUser , emailVerification, getUsers, loginUser  } from "../controllers/user.controller.js";
import { authenticateToken } from "../middelware/authMiddleware.js";
import jwt from "jsonwebtoken";
import {getUserTransactions} from "../controllers/transaction.controller.js";
import {getLatestActiveSubscription} from "../controllers/subscription.controller.js";

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

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        return res.status(200).json({ valid: true, message: 'Token is valid' });
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