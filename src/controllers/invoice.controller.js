// controllers/invoice.controller.js
import Invoice from '../models/invoice.model.js';


export const calculateDueAmount= (plan)=>{
    return plan.price

}

// Create a new invoice
export const createInvoice = async (req, res) => {
    try {
        const { subscription_id, amount_due, due_date, status } = req.body;
        const newInvoice = await Invoice.create({ subscription_id, amount_due, due_date, status });
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all invoices
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get an invoice by ID
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Update an invoice
export const updateInvoice = async (req, res) => {
    try {
        const { subscription_id, amount_due, due_date, status } = req.body;
        const [updated] = await Invoice.update(
            { subscription_id, amount_due, due_date, status },
            { where: { invoice_id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Invoice not found' });
        const updatedInvoice = await Invoice.findByPk(req.params.id);
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Delete an invoice
export const deleteInvoice = async (req, res) => {
    try {
        const deleted = await Invoice.destroy({
            where: { invoice_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
