import { Request, Response } from "express";
import {
  addProductController,
  getAllProductsController,
  getProductsByCategoryController,
  getProductByIdController,
  getCategoriesController,
} from "../../presentation/controllers/product.controller";
import productService from "../../application/product.service";

jest.mock("../../application/product.service");

describe("ProductController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("addProductController", () => {
    it("should add a new product", async () => {
      const mockNewProduct = { id: 1, name: "Test Product" };
      req.body = {
        name: "Test Product",
        description: "Test Description",
        price: 10,
        categoryName: "Test Category",
        categoryDescription: "Test Category Description",
      };
      (productService.addProduct as jest.Mock).mockResolvedValue(mockNewProduct);

      await addProductController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product added successfully with associated category",
        newProduct: mockNewProduct,
      });
    });

    it("should handle errors when adding a product", async () => {
      const errorMessage = "Failed to add product.";
      req.body = {
        name: "Test Product",
        description: "Test Description",
        price: 10,
        categoryName: "Test Category",
        categoryDescription: "Test Category Description",
      };
      (productService.addProduct as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await addProductController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error adding product" });
    });
  });

  describe("getAllProductsController", () => {
    it("should return all products", async () => {
      const mockProducts = [{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }];
      (productService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      await getAllProductsController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors when fetching products", async () => {
      const errorMessage = "Failed to fetch products.";
      (productService.getAllProducts as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getAllProductsController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching products" });
    });
  });

  describe("getProductsByCategoryController", () => {
    it("should return products for the specified category", async () => {
      const categoryId = 1;
      const mockProducts = [{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }];
      (productService.getProductsByCategory as jest.Mock).mockResolvedValue(mockProducts);
      req.params = { categoryId: categoryId.toString() };

      await getProductsByCategoryController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors when fetching products by category", async () => {
      const categoryId = 1;
      const errorMessage = "Failed to fetch products by category.";
      (productService.getProductsByCategory as jest.Mock).mockRejectedValue(new Error(errorMessage));
      req.params = { categoryId: categoryId.toString() };

      await getProductsByCategoryController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching products by category" });
    });
  });

  describe("getProductByIdController", () => {
    it("should return the product with the specified ID", async () => {
      const productId = 1;
      const mockProduct = { id: productId, name: "Test Product" };
      (productService.getProductById as jest.Mock).mockResolvedValue(mockProduct);
      req.params = { id: productId.toString() };

      await getProductByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should handle errors when fetching product by ID", async () => {
      const productId = 1;
      const errorMessage = "Failed to fetch product by ID.";
      (productService.getProductById as jest.Mock).mockRejectedValue(new Error(errorMessage));
      req.params = { id: productId.toString() };

      await getProductByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching product by ID" });
    });

    it("should return 404 if product with specified ID is not found", async () => {
      const productId = 1;
      (productService.getProductById as jest.Mock).mockResolvedValue(null);
      req.params = { id: productId.toString() };

      await getProductByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Product not found" });
    });
  });

  describe("getCategoriesController", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }];
      (productService.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      await getCategoriesController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it("should handle errors when fetching categories", async () => {
      const errorMessage = "Failed to fetch categories.";
      (productService.getCategories as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getCategoriesController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error fetching categories" });
    });
  });
});
