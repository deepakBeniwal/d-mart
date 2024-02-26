import { Cart } from "@prisma/client";
import { CartRepository } from "../domain/Repository/CartRepository";
import {
  findCartWithProducts,
  createCart,
  updateCartItemQuantity,
  createCartItem,
  deleteCartItem,
  deleteCartByUserId,
  viewFindCartWithProducts,
} from "../infrastructure/cartQueries";

export class CartService implements CartRepository {
  async addToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<Cart | null> {
    try {
      let shoppingCart = await findCartWithProducts(userId);

      if (!shoppingCart) {
        shoppingCart = await createCart(userId);
      }

      const existingCartItem = shoppingCart.products.find(
        (item) => item.productId === productId
      );

      if (existingCartItem) {
        await updateCartItemQuantity(
          existingCartItem.id,
          existingCartItem.quantity + quantity
        );
      } else {
        await createCartItem(quantity, productId, shoppingCart.id, userId);
      }

      const updatedCart = await findCartWithProducts(userId);

      if (!updatedCart) {
        return null; // Return null if cart is not found
      }

      return updatedCart;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw new Error("Failed to add item to cart.");
    }
  }
  async viewCart(userId: number): Promise<Cart | null> {
    const cart = await viewFindCartWithProducts(userId);
    return cart;
  }

  async updateCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<Cart | null> {
    const cart = await findCartWithProducts(userId);

    if (!cart) {
      throw new Error("Cart not found for user");
    }

    const productInCart = cart.products.find(
      (product) => product.productId === productId
    );

    if (!productInCart) {
      throw new Error("Product not found in the cart");
    }

    await updateCartItemQuantity(productInCart.id, quantity);

    return await findCartWithProducts(userId);
  }

  async removeFromCart(
    userId: number,
    productId: number
  ): Promise<Cart | null> {
    const cart = await findCartWithProducts(userId);

    if (!cart) {
      throw new Error("Cart not found for user");
    }

    const productInCart = cart.products.find(
      (product) => product.productId === productId
    );

    if (!productInCart) {
      throw new Error("Product not found in the cart");
    }

    await deleteCartItem(productInCart.id);

    const updatedCart = await findCartWithProducts(userId);

    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }

    if (updatedCart.products.length === 0) {
      await deleteCartByUserId(userId);
      return null;
    }

    return updatedCart;
  }
}

const cartService = new CartService();
export default cartService;
