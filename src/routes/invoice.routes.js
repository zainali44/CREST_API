// routes/invoice.routes.js
import express from 'express';
import { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } from '../controllers/invoice.controller.js';

const router = express.Router();

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: integer
 *               amount_due:
 *                 type: number
 *                 format: decimal
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [paid, unpaid, overdue]
 *     responses:
 *       201:
 *         description: Invoice created
 *       500:
 *         description: Server error
 */
router.post('/', createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: List of invoices
 *       500:
 *         description: Server error
 */
router.get('/', getInvoices);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getInvoiceById);

/**
 * @swagger
 * /invoices/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: integer
 *               amount_due:
 *                 type: number
 *                 format: decimal
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [paid, unpaid, overdue]
 *     responses:
 *       200:
 *         description: Invoice updated
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Invoice deleted
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteInvoice);

export default router;
