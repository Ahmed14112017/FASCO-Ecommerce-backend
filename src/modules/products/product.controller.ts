import { Request, Response } from "express";
import { Product } from "./product.model";
import cloudinary from "../../config/cloudinary";

// 🟢 Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    let imageUrl = "";
    const file = req.file;
    if (file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(file.buffer);
      });

      imageUrl = result.secure_url;
    }
    const product = await Product.create({
      ...req.body,
      images: imageUrl ? [imageUrl] : [],
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error creating product" });
  }
};

// 🟢 Get Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      category,
      min,
      max,
      sort,
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      category?: string;
      min?: string;
      max?: string;
      sort?: string;
    };

    // ✅ تحويل page & limit لأرقام
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const query: Record<string, any> = {};

    // 🔍 Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 🏷️ Category
    if (category) {
      const { Category } = await import("../categories/category.model");
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return res.json({
          products: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      }
    }

    // 💰 Price Filter
    if (min || max) {
      query.price = {
        ...(min && { $gte: Number(min) }),
        ...(max && { $lte: Number(max) }),
      };
    }
    if (req.query.colors) {
      const colorsArray = (req.query.colors as string).split(",");
      query.colors = { $in: colorsArray };
    }

    // 📏 Sizes Filter
    if (req.query.sizes) {
      const sizesArray = (req.query.sizes as string).split(",");
      query.sizes = { $in: sizesArray };
    }

    // 🔃 Sorting
    let sortOption: Record<string, 1 | -1> = {
      createdAt: -1, // default newest first
    };

    if (sort === "price_asc") {
      sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
      sortOption = { price: -1 };
    }

    // 🟢 Get Products
    const products = await Product.find(query)
      .populate("category")
      .sort(sortOption) // ✅ مهم جدًا
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // 🟢 Total Count
    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error fetching products",
    });
  }
};

// 🟢 Get Product By ID
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

// 🟢 Update Product
export const updateProduct = async (req: any, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = product.images?.[0] || "";

    // 🖼️ لو فيه صورة جديدة
    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: imageUrl ? [imageUrl] : [],
      },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("Update Product Error:", err); // ← زود السطر ده
    res.status(500).json({ message: "Error updating product", error: err });
  }
};

// 🟢 Delete Product
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
