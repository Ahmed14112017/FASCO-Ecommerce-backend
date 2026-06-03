import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlist.controller";
import { protect } from "../../middleware/auth.middleware";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
