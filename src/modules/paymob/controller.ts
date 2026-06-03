import { Request, Response } from "express";
import { Order } from "../orders/order.model";
import {
  getAuthToken,
  createPaymobOrder,
  getPaymentKey,
} from "../paymob/service";

export const paymobCheckout = async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 1. auth
    const token = await getAuthToken();

    // 2. create order in paymob
    const paymobOrder = await createPaymobOrder(token, order);

    // 3. payment key
    const paymentKey = await getPaymentKey(
      token,
      paymobOrder.id,
      order.totalPrice!,
    );

    // 4. redirect url
    const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    res.json({ url: iframeURL });
  } catch (err) {
    res.status(500).json({ message: "Paymob error" });
  }
};

export const paymobWebhook = async (req: Request, res: Response) => {
  try {
    const { success, order: paymobOrder } = req.body;

    const orderId = paymobOrder.merchant_order_id;

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).send("Order not found");

    // ✔ idempotency
    if (order.paymentStatus === "paid") {
      return res.json({ received: true });
    }

    if (success) {
      order.paymentStatus = "paid";
      order.status = "paid";
    }

    await order.save();

    res.json({ received: true });
  } catch (err) {
    res.status(500).send("Webhook error");
  }
};
