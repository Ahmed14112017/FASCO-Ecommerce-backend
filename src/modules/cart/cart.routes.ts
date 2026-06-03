import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "./cart.controller";

import { protect } from "../../middleware/auth.middleware";
import { Cart } from "./cart.model";
const router = express.Router();

router.use(protect); // كل routes محتاجة login

router.post("/", addToCart);
router.get("/", getCart);
router.put("/", updateCartItem);
router.delete("/clear", protect, async (req: any, res: any) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items.splice(0, cart.items.length);
    await cart.save();
  }
  res.json({ message: "Cart cleared" });
});

router.delete("/:productId", removeFromCart);

export default router;
