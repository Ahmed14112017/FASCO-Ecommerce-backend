import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress,
} from "./user.controller";
import { protect } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";
import { getAllUsers } from "./user.controller";
import { adminOnly } from "../../middleware/role.middleware";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.get("/", protect, adminOnly, getAllUsers);

router.put("/profile", upload.single("avatar"), updateProfile);
router.put("/change-password", changePassword);
router.post("/addresses", addAddress);
router.delete("/addresses/:addressId", deleteAddress);

export default router;
