import { Request, Response } from "express";
import { Category } from "./category.model";

export const createCategory = async (req: Request, res: Response) => {
  const category = await Category.create(req.body);
  res.json(category);
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
};
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
