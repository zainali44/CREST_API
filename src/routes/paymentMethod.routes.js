// routes/paymentMethod.routes.js
import express from 'express';
import { createPaymentMethod, getPaymentMethods, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod } from '../controllers/paymentMethod.controller.js';

const router = express.Router();

/**
 * @swagger
 * /payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags: [PaymentMethods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment method created
 *       500:
 *         description: Server error
 */
router.post('/', createPaymentMethod);

/**
 * @swagger
 * /payment-methods:
 *   get:
 *     summary: Get all payment methods
 *     tags: [PaymentMethods]
 *     responses:
 *       200:
 *         description: List of payment methods
 *       500:
 *         description: Server error
 */
router.get('/', getPaymentMethods);

/**
 * @swagger
 * /payment-methods/{id}:
 *   get:
 *     summary: Get a payment method by ID
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment method ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment method details
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getPaymentMethodById);

/**
 * @swagger
 * /payment-methods/{id}:
 *   put:
 *     summary: Update a payment method
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment method ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment method updated
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updatePaymentMethod);

/**
 * @swagger
 * /payment-methods/{id}:
 *   delete:
 *     summary: Delete a payment method
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment method ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Payment method deleted
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deletePaymentMethod);

export default router;
