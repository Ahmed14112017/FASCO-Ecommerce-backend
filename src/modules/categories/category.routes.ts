import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "./category.controller";
import { protect } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/role.middleware";

const router = express.Router();

router.post("/", protect, adminOnly, createCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);

export default router;
