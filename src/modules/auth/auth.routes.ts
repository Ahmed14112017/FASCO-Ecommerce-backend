import express from "express";
import {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  sendVerifyEmail,
  verifyEmail,
} from "./auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-verify-email", sendVerifyEmail);
router.post("/verify-email", verifyEmail);

export default router;
