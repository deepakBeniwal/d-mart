import { Request, Response } from "express";

import orderService from "../../application/orders.service";
import { sendPurchaseHistoryEmail } from "../../application/invoice.service";

export const getPurchaseHistoryController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    // Call the purchase history service to get purchase history
    const purchaseHistory = await orderService.getPurchaseHistory(userId);

    // Send email notification
    // await sendPurchaseHistoryEmail(req.user.email, purchaseHistory);

    res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching purchase history" });
  }
};

export const getPurchaseByIdController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id); // Parse the ID parameter as a number

    if (isNaN(id)) {
      res.status(400).json({ message: "ID parameter must be a number" });
      return;
    }

    // Fetch a single purchase history by ID
    const purchase = await orderService.getPurchaseById(id);

    if (!purchase) {
      res.status(404).json({ message: "Purchase not found" });
      return;
    }

    // Check if the purchase belongs to the user
    if (purchase.userId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching purchase history" });
  }
};

export const checkoutController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    // Call the cart service to perform checkout
    const purchaseHistory = await orderService.checkout(userId);

    // Return the purchase history details as JSON
    res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during checkout" });
  }
};
