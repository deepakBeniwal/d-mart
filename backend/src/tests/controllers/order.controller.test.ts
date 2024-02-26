import { Request, Response } from "express";
import {
  getPurchaseHistoryController,
  getPurchaseByIdController,
  checkoutController,
} from "../../presentation/controllers/order.controller";
import orderService from "../../application/orders.service";

jest.mock("../../application/orders.service");

describe("OrderController", () => {
  let req: any // Partial <Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { id: 1 }, // Mocking the user object
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getPurchaseHistoryController", () => {
    it("should fetch purchase history successfully", async () => {
      const mockPurchaseHistory = [{ id: 1, userId: 1, items: [] }];
      (orderService.getPurchaseHistory as jest.Mock).mockResolvedValue(
        mockPurchaseHistory
      );

      await getPurchaseHistoryController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPurchaseHistory);
    });

    it("should handle errors when fetching purchase history", async () => {
      const errorMessage = "Error fetching purchase history";
      (orderService.getPurchaseHistory as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await getPurchaseHistoryController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("getPurchaseByIdController", () => {
    it("should fetch purchase by ID successfully", async () => {
      const mockPurchase = { id: 1, userId: 1, items: [] };
      (orderService.getPurchaseById as jest.Mock).mockResolvedValue(
        mockPurchase
      );
      req.params.id = "1";

      await getPurchaseByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPurchase);
    });

    it("should handle invalid ID parameter", async () => {
      req.params.id = "abc";

      await getPurchaseByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "ID parameter must be a number",
      });
    });

    it("should handle purchase not found", async () => {
      (orderService.getPurchaseById as jest.Mock).mockResolvedValue(null);
      req.params.id = "1";

      await getPurchaseByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Purchase not found" });
    });

    it("should handle unauthorized access", async () => {
      const mockPurchase = { id: 1, userId: 2, items: [] };
      (orderService.getPurchaseById as jest.Mock).mockResolvedValue(
        mockPurchase
      );
      req.params.id = "1";

      await getPurchaseByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should handle errors when fetching purchase by ID", async () => {
      const errorMessage = "Error fetching purchase history";
      (orderService.getPurchaseById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      req.params.id = "1";

      await getPurchaseByIdController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("checkoutController", () => {
    it("should checkout successfully", async () => {
      const mockPurchaseHistory = { id: 1, userId: 1, items: [] };
      (orderService.checkout as jest.Mock).mockResolvedValue(
        mockPurchaseHistory
      );

      await checkoutController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPurchaseHistory);
    });

    it("should handle errors during checkout", async () => {
      const errorMessage = "Error during checkout";
      (orderService.checkout as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await checkoutController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
