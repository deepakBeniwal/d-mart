import productService from "../../application/product.service";
import * as productQueries from "../../infrastructure/productQueries";

// Mocking the productQueries module
jest.mock("../../infrastructure/productQueries");

describe("ProductService", () => {
  describe("addProduct", () => {
    it("should add a new product", async () => {
      // Mock data
      const name = "Test Product";
      const description = "Test Description";
      const price = 10;
      const categoryName = "Test Category";
      const categoryDescription = "Test Category Description";

      // Mocking the return value of productQueries.addProduct
      const mockNewProduct = {
        id: 1,
        name,
        description,
        price,
        category: {
          id: 1,
          name: categoryName,
          description: categoryDescription,
        },
      };
      (productQueries.addProduct as any).mockResolvedValue(mockNewProduct);

      // Calling the addProduct method
      const newProduct = await productService.addProduct(
        name,
        description,
        price,
        categoryName,
        categoryDescription
      );

      // Assertions
      expect(newProduct).toEqual(mockNewProduct);
      expect(productQueries.addProduct).toHaveBeenCalledWith(
        name,
        description,
        price,
        categoryName,
        categoryDescription
      );
    });

    it("should throw an error when adding a product fails", async () => {
      // Mock data
      const name = "Test Product";
      const description = "Test Description";
      const price = 10;
      const categoryName = "Test Category";
      const categoryDescription = "Test Category Description";

      // Mocking the rejection of productQueries.addProduct
      const errorMessage = "Failed to add product.";
      (productQueries.addProduct as any).mockRejectedValue(
        new Error(errorMessage)
      );

      // Assertions
      await expect(() =>
        productService.addProduct(
          name,
          description,
          price,
          categoryName,
          categoryDescription
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getAllProducts", () => {
    it("should get all products with pagination", async () => {
      // Mock data
      const page = 1;
      const pageSize = 10;
      const mockProducts = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ];

      // Mocking the return value of productQueries.getAllProducts
      (productQueries.getAllProducts as any).mockResolvedValue(mockProducts);

      // Calling the getAllProducts method
      const products = await productService.getAllProducts(page, pageSize);

      // Assertions
      expect(products).toEqual(mockProducts);
      expect(productQueries.getAllProducts).toHaveBeenCalledWith(
        page,
        pageSize
      );
    });

    it("should throw an error when getting all products fails", async () => {
      // Mock data
      const page = 1;
      const pageSize = 10;

      // Mocking the rejection of productQueries.getAllProducts
      const errorMessage = "Failed to get all products.";
      (productQueries.getAllProducts as any).mockRejectedValue(
        new Error(errorMessage)
      );

      // Assertions
      await expect(() =>
        productService.getAllProducts(page, pageSize)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getProductsByCategory", () => {
    it("should return products for the specified category", async () => {
      // Mock data
      const categoryId = 1;
      const mockProducts = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ];

      // Mocking the return value of productQueries.getProductsByCategory
      (productQueries.getProductsByCategory as any).mockResolvedValue(
        mockProducts
      );

      // Calling the getProductsByCategory method
      const products = await productService.getProductsByCategory(categoryId);

      // Assertions
      expect(products).toEqual(mockProducts);
      expect(productQueries.getProductsByCategory).toHaveBeenCalledWith(
        categoryId
      );
    });

    it("should throw an error when getting products by category fails", async () => {
      // Mock data
      const categoryId = 1;

      // Mocking the rejection of productQueries.getProductsByCategory
      const errorMessage = "Failed to get products by category.";
      (productQueries.getProductsByCategory as any).mockRejectedValue(
        new Error(errorMessage)
      );

      // Assertions
      await expect(() =>
        productService.getProductsByCategory(categoryId)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getProductById", () => {
    it("should return the product with the specified ID", async () => {
      // Mock data
      const productId = 1;
      const mockProduct = { id: productId, name: "Product 1" };

      // Mocking the return value of productQueries.getProductById
      (productQueries.getProductById as any).mockResolvedValue(mockProduct);

      // Calling the getProductById method
      const product = await productService.getProductById(productId);

      // Assertions
      expect(product).toEqual(mockProduct);
      expect(productQueries.getProductById).toHaveBeenCalledWith(productId);
    });

    it("should throw an error when getting a product by ID fails", async () => {
      // Mock data
      const productId = 1;

      // Mocking the rejection of productQueries.getProductById
      const errorMessage = "Failed to get product by ID.";
      (productQueries.getProductById as any).mockRejectedValue(
        new Error(errorMessage)
      );

      // Assertions
      await expect(() =>
        productService.getProductById(productId)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("getCategories", () => {
    it("should return categories", async () => {
      // Mock data
      const mockCategories = [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
      ];

      // Mocking the return value of productQueries.getCategories
      (productQueries.getCategories as any).mockResolvedValue(mockCategories);

      // Calling the getCategories method
      const categories = await productService.getCategories();

      // Assertions
      expect(categories).toEqual(mockCategories);
      expect(productQueries.getCategories).toHaveBeenCalled();
    });

    it("should throw an error when getting categories fails", async () => {
      // Mocking the rejection of productQueries.getCategories
      const errorMessage = "Failed to get categories.";
      (productQueries.getCategories as any).mockRejectedValue(
        new Error(errorMessage)
      );

      // Assertions
      await expect(() => productService.getCategories()).rejects.toThrow(
        errorMessage
      );
    });
  });
});
