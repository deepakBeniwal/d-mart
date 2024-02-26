import { Cart } from "../entities/Cart";

export interface CartRepository {
  addToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<Cart | null>;

  viewCart(userId: number): Promise<Cart | null>;
  updateCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<Cart | null>;

  removeFromCart(userId: number, productId: number): Promise<Cart | null>;
}
