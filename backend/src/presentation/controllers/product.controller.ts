// src/controllers/product.controller.ts

import { Request, Response } from "express";
import productService from "../../application/product.service";

export const addProductController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, price, categoryName, categoryDescription } =
    req.body;

  try {
    const newProduct = await productService.addProduct(
      name,
      description,
      price,
      categoryName,
      categoryDescription
    );
    res.status(201).json({
      message: "Product added successfully with associated category",
      newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const products = await productService.getAllProducts(page, pageSize);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductsByCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categoryId = parseInt(req.params.categoryId, 10);

  try {
    const productsInCategory = await productService.getProductsByCategory(
      categoryId
    ); // Pass the DTO object
    res.status(200).json(productsInCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products by category" });
  }
};
export const getProductByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  try {
    const product = await productService.getProductById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product by ID" });
  }
};
export const getCategoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await productService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};
