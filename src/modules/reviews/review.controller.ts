import { Request, Response } from "express";
import { Review } from "./review.model";
import { Product } from "../products/product.model";

// 🟢 Add Review
export const addReview = async (req: any, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;

    // تحقق لو عمل review قبل كده
    const existing = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    // حدّث الـ rating في الـ product
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    const populated = await review.populate("user", "name avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error adding review" });
  }
};

// 🟢 Get Product Reviews
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// 🟢 Delete Review
export const deleteReview = async (req: any, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review" });
  }
};
