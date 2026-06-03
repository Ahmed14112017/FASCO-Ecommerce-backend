import { Request, Response } from "express";
import { Order } from "./order.model";
import { Cart } from "../cart/cart.model";
import { Product } from "../products/product.model";
// import { stripe } from "../../config/stripe";

export const createOrder = async (req: any, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;

    const orderItems = [];

    for (const item of cart.items as any[]) {
      const product = item.product;

      // ✅ check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // ✅ atomic update
      await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
    });

    // 🧹 clear cart
    cart.items.splice(0, cart.items.length);
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order" });
  }
};
export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product",
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.product");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
};
export const payOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.paymentStatus = "paid";
  order.status = "paid";

  await order.save();

  res.json(order);
};
