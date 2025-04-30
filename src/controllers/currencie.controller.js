import Currencie from '../models/currencie.model.js';

// Create a new currency
export const createCurrencie = async (req, res) => {
    try {
        const { code, name } = req.body;
        const newCurrencie = await Currencie.create({ code, name });
        res.status(201).json(newCurrencie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all currencies
export const getCurrencies = async (req, res) => {
    try {
        const currencies = await Currencie.findAll();
        res.status(200).json(currencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Get a currency by ID
export const getCurrencieById = async (req, res) => {
    try {
        const currencie = await Currencie.findByPk(req.params.id);
        if (!currencie) return res.status(404).json({ message: 'Currencie not found' });
        res.status(200).json(currencie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Update a currency
export const updateCurrencie = async (req, res) => {
    try {
        const { code, name } = req.body;
        const [updated] = await Currencie.update(
            { code, name },
            { where: { id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Currencie not found' });
        const updatedCurrencie = await Currencie.findByPk(req.params.id);
        res.status(200).json(updatedCurrencie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Delete a currency
export const deleteCurrencie = async (req, res) => {
    try {
        const deleted = await Currencie.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Currencie not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
