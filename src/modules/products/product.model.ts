import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    images: [String],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    stock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
