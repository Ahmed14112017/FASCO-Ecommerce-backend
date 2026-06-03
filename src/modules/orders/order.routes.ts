import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  payOrder
} from "./order.controller";

import { protect } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/role.middleware";

const router = express.Router();

// user
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.put("/:id/pay", protect, payOrder);

// admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);

export default router;
