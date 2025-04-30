import express from 'express';
import { createPlan, getPlans, getPlanById, updatePlan, deletePlan } from '../controllers/plan.controller.js';

const router = express.Router();

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               billing_cycle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Plan created
 *       500:
 *         description: Server error
 */
router.post('/', createPlan);

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Get all plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of plans
 *       500:
 *         description: Server error
 */
router.get('/', getPlans);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Get a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Plan ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan details
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getPlanById);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Update a plan
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Plan ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               billing_cycle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan updated
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updatePlan);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Delete a plan
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Plan ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Plan deleted
 *       404:
 *         description: Plan not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deletePlan);

export default router;