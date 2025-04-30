// routes/currencie.routes.js
import express from 'express';
import { createCurrencie, getCurrencies, getCurrencieById, updateCurrencie, deleteCurrencie } from '../controllers/currencie.controller.js';

const router = express.Router();

/**
 * @swagger
 * /currencies:
 *   post:
 *     summary: Create a new currency
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Currency created
 *       500:
 *         description: Server error
 */
router.post('/', createCurrencie);

/**
 * @swagger
 * /currencies:
 *   get:
 *     summary: Get all currencies
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: List of currencies
 *       500:
 *         description: Server error
 */
router.get('/', getCurrencies);

/**
 * @swagger
 * /currencies/{id}:
 *   get:
 *     summary: Get a currency by ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Currency ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Currency details
 *       404:
 *         description: Currency not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getCurrencieById);

/**
 * @swagger
 * /currencies/{id}:
 *   put:
 *     summary: Update a currency
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Currency ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Currency updated
 *       404:
 *         description: Currency not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateCurrencie);

/**
 * @swagger
 * /currencies/{id}:
 *   delete:
 *     summary: Delete a currency
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Currency ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Currency deleted
 *       404:
 *         description: Currency not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteCurrencie);

export default router;
