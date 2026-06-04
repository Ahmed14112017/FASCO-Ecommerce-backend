import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
} from "./review.controller";
import { protect } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", protect, addReview);
router.delete("/:id", protect, deleteReview);

export default router;
