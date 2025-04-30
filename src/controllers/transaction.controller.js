// controllers/transaction.controller.js
import Transaction from '../models/transaction.model.js';
import PaymentMethod from "../models/paymentMethod.model.js";
import Currencie from "../models/currencie.model.js";
import Invoice from "../models/invoice.model.js";
import Subscription from "../models/subscription.model.js";
import Plan from "../models/plan.model.js";
import {getNextBillingDate} from "./subscription.controller.js";
import {calculateDueAmount} from "./invoice.controller.js";
import sequelize from "../config/squeDB.js";
import BankTransactionDetail from "../models/bank_details.model.js";
import User from "../models/user.model.js";
import {where} from "sequelize";

const sanitizeTransactionMetadata = (metadata) => ({
    err_code: metadata.err_code || '000',
    err_msg: metadata.err_msg || 'Success',
    transaction_id: metadata.transaction_id,
    basket_id: metadata.basket_id,
    order_date: metadata.order_date,
    Rdv_Message_Key: metadata.Rdv_Message_Key,
    Response_Key: metadata.Response_Key,
    PaymentType: metadata.PaymentType,
    PaymentName: metadata.PaymentName,
    validation_hash: metadata.validation_hash,
    transaction_amount: metadata.transaction_amount,
    merchant_amount: metadata.merchant_amount,
    discounted_amount: metadata.discounted_amount || null,
    issuer_name: metadata.issuer_name,
    transaction_currency: metadata.transaction_currency,
    BillNumber: metadata.BillNumber || null,
    CustomerId: metadata.CustomerId || null,
    Recurring_txn: metadata.Recurring_txn || false,
    additional_value: metadata.additional_value || null,
    additional_fee: metadata.additional_fee || 0,
    email_address: metadata.email_address || null,
    mobile_no: metadata.mobile_no || null,
});

export const createTransaction = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        console.log("Creating transaction...");
        const { user_id, plan_id, metadata } = req.body;
       console.log(`META DATA : ${metadata}`);

       const paymentMetadata= sanitizeTransactionMetadata(metadata)
        // Validate required fields
        const requiredFields = { user_id, plan_id,  metadata };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate metadata structure
        const requiredMetadata = ['err_code'];
        const missingMetadata = requiredMetadata.filter(field => !metadata[field]);

        if (missingMetadata.length > 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: `Missing required metadata fields: ${missingMetadata.join(', ')}`
            });
        }

        // Process payment method
        const { PaymentName: paymentMethod, issuer_name, transaction_currency: currency } = metadata;
        const [payment_method] = await PaymentMethod.findOrCreate({
            where: { type: paymentMethod, details: issuer_name },
            transaction
        });

        // Get or create currency
        const [currencyRecord] = await Currencie.findOrCreate({
            where: { code: currency },
            defaults: { code: currency },
            transaction
        });

        // Verify plan exists
        const plan = await Plan.findByPk(plan_id, { transaction });
        if (!plan) {
            await transaction.rollback();
            return res.status(404).json({ message: "Plan not found" });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                message: `User with ID ${user_id} does not exist.`
            });
        }


        // Calculate billing dates
        const start_date = new Date();
        const billing_cycle = plan.billing_cycle;
        const { next_billing_date, end_date } = getNextBillingDate(start_date, billing_cycle);

        if (!next_billing_date || !end_date) {
            await transaction.rollback();
            return res.status(400).json({ message: "Invalid billing date calculation" });
        }

        // Create subscription
        const subscription = await Subscription.create({
            user_id,
            plan_id,
            status: "inactive",
            start_date,
            end_date,
            next_billing_date,
        }, { transaction });

        // Create invoice
        const amount_due = calculateDueAmount(plan);
        if (isNaN(amount_due)) {
            await transaction.rollback();
            return res.status(500).json({ message: "Invalid amount calculation" });
        }

        const invoice = await Invoice.create({
            subscription_id: subscription.subscription_id,
            amount_due,
            due_date: next_billing_date,
            status: 'unpaid'
        }, { transaction });

        if(paymentMetadata.err_code==="000" || paymentMetadata.err_msg==="success"){
             await Invoice.update(
                { status: 'paid' },
                { where: { invoice_id: invoice.invoice_id }, transaction }
            );

            await Subscription.update(
                { status: 'active' },
                { where: { subscription_id: subscription.subscription_id }, transaction }
            );
        }
        // Create transaction
        const transactionData = {
            invoice_id: invoice.invoice_id,
            payment_method_id: payment_method.payment_method_id,
            status:'completed',
            processed_at: metadata.order_date,
            currencie: currencyRecord.code,
            metadata: sanitizeTransactionMetadata(metadata)
        };

        const newTransaction = await Transaction.create(transactionData, { transaction });
          console.log("TRANSACTION CREATED")
        if (newTransaction){
                    await BankTransactionDetail.create({
            transaction_id: newTransaction.transaction_id,
            order_date: metadata.order_date,
            bill_number: metadata.BillNumber,
            payment_reference: metadata.transaction_id,
            customer_id: metadata.CustomerId,
            email_address: metadata.email_address,
            mobile_no: metadata.mobile_no,
            additional_info: {
                PaymentType: metadata.PaymentType,
                PaymentName: metadata.PaymentName,
                issuer_name: metadata.issuer_name
            }
        }, { transaction });

        }


        await transaction.commit();
        return res.status(201).json(newTransaction);

    } catch (error) {
        await transaction.rollback();
        console.error("Transaction creation failed:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

};




export  const createLiteTransaction=async (req,res)=>{
        const transaction = await sequelize.transaction();

    try {

        const { invoice_id ,metadata } = req.body;

        const transactionMetadata = sanitizeTransactionMetadata(metadata);


        const { PaymentName: paymentMethod, issuer_name, transaction_currency: currency } = metadata;
        const [payment_method] = await PaymentMethod.findOrCreate({
            where: { type: paymentMethod, details: issuer_name },
            transaction
        });

        // Get or create currency
        const [currencyRecord] = await Currencie.findOrCreate({
            where: { code: currency },
            defaults: { code: currency },
            transaction
        });

        const transaction = await Transaction.create({
            invoice_id:invoice_id

        })
    }
    catch{

    }

}
export const getUserTransactions = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const transactions = await Transaction.findAll({
            include: [
                {
                    model: Invoice,
                    as: 'invoice',
                    required: true,
                    include: [
                        {
                            model: Subscription,
                            as: 'subscription',
                            required: true,
                            where: { user_id: userId },
                            include: [
                                {
                                    model: Plan,
                                    as: 'plan',
                                    attributes: ['plan_id', 'name', 'price', 'description', 'billing_cycle']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: PaymentMethod,
                    as: 'paymentMethod',
                    attributes: ['payment_method_id', 'type', 'details']
                },
                {
                    model: Currencie,
                    as: 'currency',
                    attributes: ['code', 'name']
                },
                {
                    model: BankTransactionDetail,
                    as: 'bankDetail'
                }
            ],
            order: [
                ['processed_at', 'DESC']
            ]
        });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user" });
        }

        // Format response (adjust as needed)
        const formattedTransactions = transactions.map(transaction => ({
            transaction_id: transaction.transaction_id,
            status: transaction.status,
            processed_at: transaction.processed_at,
            currency: transaction.currencie,
            payment_method: transaction.paymentMethod,
            amount: transaction.metadata.merchant_amount,
            bank_detail: transaction.bankDetail,
        }));

        res.status(200).json({
            user_id: userId,
            count: transactions.length,
            transactions: formattedTransactions
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Get all transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a transaction by ID

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Update a transaction
export const updateTransaction = async (req, res) => {
    try {
        const { invoice_id, payment_method_id, status, processed_at, currencie, metadata } = req.body;
        const [updated] = await Transaction.update(
            { invoice_id, payment_method_id, status, processed_at, currencie, metadata },
            { where: { transaction_id: req.params.id } }
        );
        if (!updated) return res.status(404).json({ message: 'Transaction not found' });
        const updatedTransaction = await Transaction.findByPk(req.params.id);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        const deleted = await Transaction.destroy({
            where: { transaction_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
