// import { Request, Response } from "express";
// import { stripe } from "../../config/stripe";
// import { Order } from "../orders/order.model";

// export const createCheckoutSession = async (req: any, res: Response) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("items.product");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // 🔐 check owner
//     if (order.user?.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card"],

//       line_items: order.items.map((item: any) => ({
//         quantity: item.quantity,
//         price_data: {
//           currency: "usd",
//           unit_amount: item.price * 100,
//           product_data: {
//             name: item.product.name,
//           },
//         },
//       })),

//       success_url: `${process.env.CLIENT_URL}/success`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,

//       metadata: {
//         orderId: order._id.toString(),
//       },
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     res.status(500).json({ message: "Stripe error" });
//   }
// };

// export const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET!,
//     );
//   } catch (err) {
//     return res.status(400).send("Webhook Error");
//   }

//   // 🎯 أهم event
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as any;

//     const orderId = session.metadata.orderId;

//     await Order.findByIdAndUpdate(orderId, {
//       paymentStatus: "paid",
//       status: "paid",
//     });
//   }

//   res.json({ received: true });
// };
