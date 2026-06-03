// import express from "express";
// import { createCheckoutSession, stripeWebhook } from "./stripe.controller";
// import { protect } from "../../middleware/auth.middleware";

// const router = express.Router();

// // create checkout
// router.post("/checkout/:orderId", protect, createCheckoutSession);

// // webhook (no auth)
// router.post("/webhook", stripeWebhook);

// export default router;
