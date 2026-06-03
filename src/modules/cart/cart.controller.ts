import { Request, Response } from "express";
import { Cart } from "./cart.model";

export const addToCart = async (req: any, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item: any) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const getCart = async (req: any, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i: any) => i.product.toString() === productId,
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart" });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.pull({ product: productId });

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
};
