import express from "express";
import { paymobCheckout } from "../paymob/controller";
import { protect } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/checkout/:id", protect, paymobCheckout);

export default router;
