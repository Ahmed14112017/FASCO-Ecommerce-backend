import { Response } from "express";
import { Wishlist } from "./wishlist.model";

// 🟢 Get Wishlist
export const getWishlist = async (req: any, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "items",
    );
    res.json(wishlist?.items || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

// 🟢 Add To Wishlist
export const addToWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    const exists = wishlist.items.some(
      (item: any) => item.toString() === productId,
    );

    if (!exists) {
      wishlist.items.push(productId);
      await wishlist.save();
    }

    res.json(wishlist.items);
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

// 🟢 Remove From Wishlist
export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (item: any) => item.toString() !== req.params.productId,
    ) as any;

    await wishlist.save();

    res.json(wishlist.items);
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
};
