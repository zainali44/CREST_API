
import Subscription from '../models/subscription.model.js';
import Plan from "../models/plan.model.js";
import moment from 'moment';

// Create a new subscription


export const getNextBillingDate=(start_date,billing_cycle)=>{
         let end_date = null;
        let next_billing_date = null;
        switch (billing_cycle) {
            case 'daily':
                end_date = moment(start_date).add(1, 'days').toDate();
                next_billing_date = moment(start_date).add(1, 'days').format('YYYY-MM-DD');
                break;
            case 'weekly':
                end_date = moment(start_date).add(1, 'week').toDate();
                next_billing_date = moment(start_date).add(1, 'week').format('YYYY-MM-DD');
                break;
            case 'monthly':
                end_date = moment(start_date).add(1, 'month').toDate();
                next_billing_date = moment(start_date).add(1, 'month').format('YYYY-MM-DD');
                break;
            case 'yearly':
                end_date = moment(start_date).add(1, 'year').toDate();
                next_billing_date = moment(start_date).add(1, 'year').format('YYYY-MM-DD');
                break;
            default:
                return null

        }
        return {next_billing_date:next_billing_date ,end_date: end_date}

}

export const createSubscription = async (req, res) => {
    try {
        const { user_id, plan_id, status } = req.body;

        const start_date = moment().toDate();

        const plan = await Plan.findByPk(plan_id);
        const billing_cycle = plan ? plan.billing_cycle : null;

        if (!billing_cycle) {
            return res.status(400).json({ message: 'Billing cycle not found for this plan.' });
        }

        const nextBillingDate = getNextBillingDate(start_date,billing_cycle).next_billing_date;
        const endDate = getNextBillingDate(start_date,billing_cycle).next_billing_date;


        if(!nextBillingDate){
            res.statusCode(502).json({message:"Next Billing Date Issue"})
        }


        const newSubscription = await Subscription.create({
            user_id,
            plan_id,
            status,
            start_date,
            endDate,
            nextBillingDate
        });

        res.status(201).json(newSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all subscriptions
export const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get a subscription by ID
export const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);
        if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Update a subscription
export const updateSubscription = async (req, res) => {
    try {
        const { user_id, plan_id, status, start_date, end_date, next_billing_date } = req.body;
        const [updated] = await Subscription.update({ user_id, plan_id, status, start_date, end_date, next_billing_date }, {
            where: { subscription_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ message: 'Subscription not found' });
        const updatedSubscription = await Subscription.findByPk(req.params.id);
        res.status(200).json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Delete a subscription
export const deleteSubscription = async (req, res) => {
    try {
        const deleted = await Subscription.destroy({
            where: { subscription_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Subscription not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const getLatestActiveSubscription = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const subscription = await Subscription.findOne({
            where: {
                user_id: userId,
                status: 'active',
            },
            include: [{
                model: Plan,
                as : 'plan',
                attributes: ['plan_id', 'name', 'description', 'price', 'billing_cycle'],
            }],
            order: [['start_date', 'DESC']],
        });

        if (!subscription) {
            return res.status(404).json({ message: "No active subscription found" });
        }

        return res.status(200).json(subscription);
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
