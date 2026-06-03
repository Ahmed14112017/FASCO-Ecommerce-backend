import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { generateToken } from "../../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
  });

  const token = generateToken({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.json({ user, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid" });

  const token = generateToken({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.json({ user, token });
};
export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "idToken is required" });
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // ✅ check إن payload موجود
  if (!payload || !payload.email) {
    return res.status(401).json({ message: "Invalid Google token" });
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      password: "google-login",
    });
  }

  const token = generateToken({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.json({ user, token });
};

// ── 1. Forgot Password ──
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // عمل token عشوائي
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    user.email,
    "Reset Your Password",
    `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Reset Password
      </a>
      <p>This link is valid for 15 minutes only.</p>
    `,
  );

  res.json({ message: "Reset email sent" });
};

// ── 2. Reset Password ──
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // hash الـ token عشان نقارنه بالـ DB
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpiry: { $gt: new Date() }, // لسه مش expired
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

// ── 3. Send Verify Email ──
export const sendVerifyEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(400).json({ message: "Already verified" });

  // عمل OTP 6 أرقام
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.verifyCode = otp;
  user.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  await sendEmail(
    user.email,
    "Verify Your Email",
    `
      <h2>Verify Your Email</h2>
      <p>الكود بتاعك هو:</p>
      <h1 style="letter-spacing:8px;font-size:36px;">${otp}</h1>
      <p>This code is valid for 10 minutes only.</p>
    `,
  );

  res.json({ message: "Verification email sent" });
};

// ── 4. Verify Email ──
export const verifyEmail = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    verifyCode: otp,
    verifyCodeExpiry: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

  user.isVerified = true;
  user.verifyCode = undefined;
  user.verifyCodeExpiry = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};
