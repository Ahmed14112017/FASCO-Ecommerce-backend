import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: { type: String, required: true, unique: true, lowercase: true },
  image: { url: String, public_id: String },
});

export const Category = mongoose.model("Category", categorySchema);
