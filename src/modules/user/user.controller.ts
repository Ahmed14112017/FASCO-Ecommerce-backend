import { Request, Response } from "express";
import { User } from "../auth/user.model";
import cloudinary from "../../config/cloudinary";
import bcrypt from "bcryptjs";

// 🟢 Get Profile
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -verifyCode -resetPasswordToken",
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// 🟢 Update Profile
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, phone } = req.body;
    let avatarUrl;

    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      { new: true },
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

// 🟢 Change Password
export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
};

// 🟢 Add Address
export const addAddress = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.addresses.push(req.body);
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: "Error adding address" });
  }
};

// 🟢 Delete Address
export const deleteAddress = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.addresses.findIndex(
      (addr: any) => addr._id.toString() !== req.params.addressId,
    );
    user.addresses.splice(index, 1);
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: "Error deleting address" });
  }
};
