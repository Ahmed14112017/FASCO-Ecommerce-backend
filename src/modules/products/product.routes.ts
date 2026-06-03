import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.controller";

import { protect } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/role.middleware";
import { upload } from "../../middleware/upload.middleware";
import multer from "multer";

const router = express.Router();

// public
router.get("/", getProducts);
router.get("/:id", getProductById);

// admin only
router.post("/", protect, adminOnly, upload.single("image"), createProduct);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"), // 🔥 مهم
  updateProduct,
);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
