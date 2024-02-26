
import * as checkoutQueries from "../infrastructure/checkoutQueries";
import { OrderRepository } from "../domain/Repository/OrderRepository";
import { PurchaseHistory } from "../domain/entities/Order";
import * as purchaseHistoryQueries from "../infrastructure/purchaseHistoryQueries";
export class OrderService implements OrderRepository {
  async checkout(userId: number): Promise<PurchaseHistory> {
    const cart = await checkoutQueries.findCartForUser(userId);

    if (!cart) {
      throw new Error("Cart not found for user");
    }

    // Calculate total items and total price
    const totalItems = cart.products.reduce(
      (total: number, product: any) => total + product.quantity,
      0
    );

    const totalPrice = cart.products.reduce(
      (total: number, product: any) =>
        total + product.quantity * product.product.price,
      0
    );

    const purchaseHistory = await checkoutQueries.createPurchaseHistory(
      userId,
      totalItems,
      totalPrice,
      cart.products
    );

    await checkoutQueries.updatePurchaseHistory(
      purchaseHistory.id,
      cart.products
    );

    // Clear the user's cart
    await checkoutQueries.clearCartItems(cart.id);

    // Now, delete the ShoppingCart record
    await checkoutQueries.deleteShoppingCart(userId);

    return purchaseHistory;
  }

  async getPurchaseHistory(userId: number): Promise<PurchaseHistory[] | null> {
    try {
      return await purchaseHistoryQueries.getPurchaseHistory(userId);
    } catch (error) {
      console.error("Error getting purchase history:", error);
      throw new Error("Failed to get purchase history.");
    }
  }

  async getPurchaseById(id: number): Promise<PurchaseHistory | null> {
    try {
      return await purchaseHistoryQueries.getPurchaseById(id);
    } catch (error) {
      console.error("Error getting purchase by ID:", error);
      throw new Error("Failed to get purchase by ID.");
    }
  }
}

const orderService = new OrderService();
export default orderService;
