// productService.ts

import * as productQueries from "../infrastructure/productQueries";

import { ProductRepository } from "../domain/Repository/ProductRepository";

export class ProductService implements ProductRepository {

  async addProduct(
    name: string,
    description: string,
    price: number,
    categoryName: string,
    categoryDescription: string
  ): Promise<any> {
    try {
      const newProduct = await productQueries.addProduct(
        name,
        description,
        price,
        categoryName,
        categoryDescription
      );
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Failed to add product.");
    }
  }

  async getAllProducts(page: number, pageSize: number): Promise<any> {
    try {
      const products = await productQueries.getAllProducts(page, pageSize);
      return products;
    } catch (error) {
      console.error("Error getting all products:", error);
      throw new Error("Failed to get all products.");
    }
  }

  async getProductsByCategory(categoryId: number): Promise<any> {
    try {
      const products = await productQueries.getProductsByCategory(categoryId);
      return products;
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw new Error("Failed to get products by category.");
    }
  }

  async getProductById(id: number): Promise<any> {
    try {
      const product = await productQueries.getProductById(id);
      return product;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      throw new Error("Failed to get product by ID.");
    }
  }

  async getCategories(): Promise<any> {
    try {
      const categories = await productQueries.getCategories();
      return categories;
    } catch (error) {
      console.error("Error getting categories:", error);
      throw new Error("Failed to get categories.");
    }
  }
}

const productService = new ProductService();
export default productService;
