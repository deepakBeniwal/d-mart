import { Request, Response } from "express";
import {
  addToCartController,
  viewCartController,
  updateCartController,
  removeFromCartController,
} from "../../presentation/controllers/cart.controller";
import cartService from "../../application/cart.service";

jest.mock("../../application/cart.service");

describe("Cart Controller", () => {
  let req: any; // Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("addToCartController", () => {
    it("should add a product to the cart", async () => {
      const mockCart = { id: 1, userId: 1, products: [{ productId: 123, quantity: 2 }] };
      req.user = { id: 1 };
      req.body = { productId: 123, quantity: 2 };
      (cartService.addToCart as jest.Mock).mockResolvedValue(mockCart);

      await addToCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    it("should handle error when adding product to cart", async () => {
      const errorMessage = "Failed to add product to cart.";
      req.user = { id: 1 };
      req.body = { productId: 123, quantity: 2 };
      (cartService.addToCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await addToCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error adding product to cart" });
    });
  });

  describe("viewCartController", () => {
    it("should view the user's cart", async () => {
      const mockCart = {
        userId: 1,
        products: [{ productId: 123, quantity: 2, product: { name: "Test Product", description: "Test Description", price: 10 } }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      req.user = { id: 1 };
      (cartService.viewCart as jest.Mock).mockResolvedValue(mockCart);

      await viewCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        userId: 1,
        user: { id: 1, email: undefined },
        products: [{ productId: 123, quantity: 2, productName: "Test Product", productDescription: "Test Description", price: 10 }],
        createdAt: mockCart.createdAt,
        updatedAt: mockCart.updatedAt,
      });
    });

    it("should handle error when viewing cart", async () => {
      const errorMessage = "Failed to view cart.";
      req.user = { id: 1 };
      (cartService.viewCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await viewCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error viewing cart" });
    });
  });

  describe("updateCartController", () => {
    it("should update the quantity of a product in the cart", async () => {
      const mockCart = { id: 1, userId: 1, products: [{ productId: 123, quantity: 5 }] };
      req.user = { id: 1 };
      req.params = { productId: "123" };
      req.body = { quantity: 5 };
      (cartService.updateCart as jest.Mock).mockResolvedValue(mockCart);

      await updateCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    it("should handle error when updating cart", async () => {
      const errorMessage = "Failed to update cart.";
      req.user = { id: 1 };
      req.params = { productId: "123" };
      req.body = { quantity: 5 };
      (cartService.updateCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await updateCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error updating cart" });
    });
  });

  describe("removeFromCartController", () => {
    it("should remove a product from the cart", async () => {
      const mockCart = { id: 1, userId: 1, products: [] };
      req.user = { id: 1 };
      req.params = { productId: "123" };
      (cartService.removeFromCart as jest.Mock).mockResolvedValue(mockCart);

      await removeFromCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    it("should handle error when removing product from cart", async () => {
      const errorMessage = "Failed to remove product from cart.";
      req.user = { id: 1 };
      req.params = { productId: "123" };
      (cartService.removeFromCart as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await removeFromCartController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error removing product from cart" });
    });
  });
});
