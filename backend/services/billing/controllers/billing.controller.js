import razorpay from "../config/razorpay.js";
import { PLANS } from "../config/plans.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto";
import axios from "axios";

// creates an order
export const createOrder = async (req, res) => {

    try {
        const { plan } = req.body;
        const userId = req.headers["x-user-id"];
        const selectedPlan = PLANS[plan];

        if (!selectedPlan) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan"
            });
        }

        // create an order using razorpay
        const order = await razorpay.orders.create({
            amount: selectedPlan.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        // create payment using the order and selected plan
        await Payment.create({
            userId,
            orderId: order.id,
            amount: selectedPlan.amount,
            credits: selectedPlan.credits,
            plan: selectedPlan.id,
            currency: order.currency,
            status: "created"
        });

        // return the order
        return res.json({
            success: true,
            order,
            plan: selectedPlan
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// verify the payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // creating a signature using raxorPay secret key
        const generatedSignature = crypto
            .createHmac(
                "sha256", // algorithm
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex"); 

        // compare the rcvd and generated signature
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const payment = await Payment.findOne({
            orderId: razorpay_order_id
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });

        }

        payment.status = "paid";
        payment.paymentId = razorpay_payment_id;

        await payment.save();

        // update the user plan and credits in auth service
        await axios.patch(
            `${process.env.AUTH_SERVICE}/internal/update-plan`,
            {
                userId: payment.userId,
                plan: payment.plan,
                credits: payment.credits
            }
        );

        return res.json({
            success: true,
            message: "Payment verified successfully"
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};