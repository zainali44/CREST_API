// controllers/paymentMethod.controller.js
import PaymentMethod from '../models/paymentMethod.model.js';

// Create a new payment method
export const createPaymentMethod = async (req, res) => {
    try {
        const { type, details } = req.body;
        const newPaymentMethod = await PaymentMethod.create({ type, details });
        res.status(201).json(newPaymentMethod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Get all payment methods
export const getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.findAll();
        res.status(200).json(paymentMethods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Get a payment method by ID
export const getPaymentMethodById = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findByPk(req.params.id);
        if (!paymentMethod) return res.status(404).json({ message: 'Payment method not found' });
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Update a payment method
export const updatePaymentMethod = async (req, res) => {
    try {
        const { type, details } = req.body;
        const [updated] = await PaymentMethod.update(
            { type, details },
            { where: { payment_method_id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Payment method not found' });
        const updatedPaymentMethod = await PaymentMethod.findByPk(req.params.id);
        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Delete a payment method
export const deletePaymentMethod = async (req, res) => {
    try {
        const deleted = await PaymentMethod.destroy({
            where: { payment_method_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Payment method not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
