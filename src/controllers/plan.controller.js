import Plan from '../models/plan.model.js';

// Create a new plan
export const createPlan = async (req, res) => {
    try {
        const { name, description, price, billing_cycle } = req.body;
        const newPlan = await Plan.create({ name, description, price, billing_cycle });
        res.status(201).json(newPlan);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all plans
export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.findAll();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get a plan by ID
export const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Update a plan
export const updatePlan = async (req, res) => {
    try {
        const { name, description, price, billing_cycle } = req.body;
        const [updated] = await Plan.update({ name, description, price, billing_cycle }, {
            where: { plan_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ message: 'Plan not found' });
        const updatedPlan = await Plan.findByPk(req.params.id);
        res.status(200).json(updatedPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Delete a plan
export const deletePlan = async (req, res) => {
    try {
        const deleted = await Plan.destroy({
            where: { plan_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Plan not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
