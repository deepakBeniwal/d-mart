import * as checkoutQueries from "../../infrastructure/checkoutQueries";
import * as purchaseHistoryQueries from "../../infrastructure/purchaseHistoryQueries";
import { OrderService } from "../../application/orders.service";

jest.mock("../../infrastructure/checkoutQueries");
jest.mock("../../infrastructure/purchaseHistoryQueries");

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  describe("checkout", () => {
    it("should checkout successfully", async () => {
      const userId = 1;
      const mockCart = {
        id: 1,
        userId: 1,
        products: [{ productId: 1, quantity: 2, product: { price: 10 } }],
      };
      const mockPurchaseHistory = { id: 1, userId: 1 };

      (checkoutQueries.findCartForUser as jest.Mock).mockResolvedValue(mockCart);
      (checkoutQueries.createPurchaseHistory as jest.Mock).mockResolvedValue(mockPurchaseHistory);

      const result = await orderService.checkout(userId);

      expect(result).toEqual(mockPurchaseHistory);
      expect(checkoutQueries.findCartForUser).toHaveBeenCalledWith(userId);
      expect(checkoutQueries.createPurchaseHistory).toHaveBeenCalledWith(
        userId,
        2, // Total items
        20, // Total price
        mockCart.products
      );
      expect(checkoutQueries.updatePurchaseHistory).toHaveBeenCalledWith(mockPurchaseHistory.id, mockCart.products);
      expect(checkoutQueries.clearCartItems).toHaveBeenCalledWith(mockCart.id);
      expect(checkoutQueries.deleteShoppingCart).toHaveBeenCalledWith(userId);
    });

    it("should throw an error if cart is not found", async () => {
      const userId = 1;

      (checkoutQueries.findCartForUser as jest.Mock).mockResolvedValue(null);

      await expect(orderService.checkout(userId)).rejects.toThrow("Cart not found for user");
    });
  });

  describe("getPurchaseHistory", () => {
    it("should get purchase history successfully", async () => {
      const userId = 1;
      const mockPurchaseHistory = [{ id: 1, userId: 1 }];

      (purchaseHistoryQueries.getPurchaseHistory as jest.Mock).mockResolvedValue(mockPurchaseHistory);

      const result = await orderService.getPurchaseHistory(userId);

      expect(result).toEqual(mockPurchaseHistory);
      expect(purchaseHistoryQueries.getPurchaseHistory).toHaveBeenCalledWith(userId);
    });

    it("should throw an error if failed to get purchase history", async () => {
      const userId = 1;

      (purchaseHistoryQueries.getPurchaseHistory as jest.Mock).mockRejectedValue(new Error("Failed to get purchase history."));

      await expect(orderService.getPurchaseHistory(userId)).rejects.toThrow("Failed to get purchase history.");
    });
  });

  describe("getPurchaseById", () => {
    it("should get purchase by ID successfully", async () => {
      const id = 1;
      const mockPurchase = { id: 1, userId: 1 };

      (purchaseHistoryQueries.getPurchaseById as jest.Mock).mockResolvedValue(mockPurchase);

      const result = await orderService.getPurchaseById(id);

      expect(result).toEqual(mockPurchase);
      expect(purchaseHistoryQueries.getPurchaseById).toHaveBeenCalledWith(id);
    });

    it("should throw an error if failed to get purchase by ID", async () => {
      const id = 1;

      (purchaseHistoryQueries.getPurchaseById as jest.Mock).mockRejectedValue(new Error("Failed to get purchase by ID."));

      await expect(orderService.getPurchaseById(id)).rejects.toThrow("Failed to get purchase by ID.");
    });
  });
});
