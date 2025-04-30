import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";
import {secretKey} from "../utils/generateRandomKey.js";
import Subscription from "../models/subscription.model.js";
import Plan from "../models/plan.model.js";


// CREATE USER
export async function createUser (req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            emailToken: secretKey
        });

        // Send verification email
        await sendMail(email, secretKey);

        const userId = user.id;
        const planId = 1;
        const status = 'active';
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        const nextBillingDate = new Date(endDate);


        const newSubscription = await Subscription.create({
            user_id: userId,
            plan_id: planId,
            status: status,
            start_date: startDate,
            end_date: endDate,
            next_billing_date: nextBillingDate
        });

        res.status(201).json({
            message: "User  created successfully. Check your email to verify your account.",
            redirectUrl: "/",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// LOGIN USER
export async function loginUser (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User  not found" });
        }

        // Check if the user is verified
        if (!user.isVerifiedEmail) {
            return res.status(406).json({ error: "Please verify your email first" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log('User  ID:', user.id, 'Type:', typeof user.id);

        const subscriptions = await Subscription.findAll({ where: { user_id: user.id } });

        if (subscriptions.length === 0) {
            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({
                token,
                subscriptions: []
            });
        }

        const plans = await Promise.all(subscriptions.map(async (subscription) => {
            try {
                const plan = await Plan.findOne({ where: { plan_id: subscription.plan_id } });
                console.log(`PLANS: ${plan}`);
                console.log(`SUBCRIPTION : ${subscription.plan_id}`);
                if (!plan) {
                    console.warn(`No plan found for subscription ID: ${subscription.subscription_id}`);
                    return { ...subscription.toJSON(), plan: null };
                }
                return { ...subscription.toJSON(), plan };
            } catch (error) {
                console.error(`Error fetching plan for subscription ID: ${subscription.subscription_id}`, error);
                return { ...subscription.toJSON(), plan: null };
            }
        }));

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            subscriptions: plans
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ error: error.message });
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET USERS
export async function getUsers(req, res) {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// EMAIL VERIFICATION
export async function emailVerification(req,res){
    console.log(req.query.emailToken)

  const emailToken = req.query.emailToken;
  console.log(emailToken)
  if (!emailToken) {
    return res.status(400).json({ status: "Failed", error: "empty request" });
  }
  let user = await User.findOne({ where: { emailToken: emailToken } });

  if (!user) {
    return res.status(404).json({ status: "Failed", error: "User not found" });
  }

  await User.update(
    { isVerifiedEmail: true, emailToken: null },
    { where: { emailToken: emailToken } }
  );
  await User.findOne({ where: { emailToken: emailToken } });
  return res
    .status(200)
    .json({ status: "Success", message: "User verified successfully",token:`${emailToken}` });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
