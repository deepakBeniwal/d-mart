import { CartService } from "../../application/cart.service";
import {
  findCartWithProducts,
  createCart,
  updateCartItemQuantity,
  createCartItem,
  deleteCartItem,
  deleteCartByUserId,
  viewFindCartWithProducts,
} from "../../infrastructure/cartQueries";

jest.mock("../../infrastructure/cartQueries");

describe("CartService", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  describe("addToCart", () => {
    // it("should add a product to the cart when the cart does not exist", async () => {
    //     // Mocking the cart query functions
    //     (findCartWithProducts as jest.Mock).mockResolvedValue(null as any); // Cart does not exist
    //     (createCart as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // Mock creating cart
    //     (createCartItem as jest.Mock).mockResolvedValue({ id: 1 }); // Mock creating cart item
      
    //     const cart = await cartService.addToCart(1, 123, 2);
      
    //     expect(cart).toBeTruthy();
    //     expect(findCartWithProducts).toHaveBeenCalledWith(1);
    //     expect(createCart).toHaveBeenCalledWith(1);
    //     expect(createCartItem).toHaveBeenCalledWith(2, 123, 1, 1);
    //   });

    // fix this 
      
      

    it("should add a product to the existing cart", async () => {
      // Mocking the cart query functions
      (findCartWithProducts as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        products: [],
      }); // Mock existing cart
      (createCartItem as jest.Mock).mockResolvedValue({ id: 1 }); // Mock creating cart item

      const cart = await cartService.addToCart(1, 123, 2);

      expect(cart).toBeTruthy();
      expect(findCartWithProducts).toHaveBeenCalledWith(1);
      expect(createCartItem).toHaveBeenCalledWith(2, 123, 1, 1);
    });

    // Add more test cases for different scenarios (e.g., when the product already exists in the cart)
  });

  describe("viewCart", () => {
    it("should return the cart with products", async () => {
      // Mocking the cart query function
      (viewFindCartWithProducts as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        products: [{ id: 1, productId: 123, quantity: 2 }],
      });

      const cart = await cartService.viewCart(1);

      expect(cart).toBeTruthy();
      expect(viewFindCartWithProducts).toHaveBeenCalledWith(1);
    });

    it("should return null when the cart does not exist", async () => {
      // Mocking the cart query function
      (viewFindCartWithProducts as jest.Mock).mockResolvedValue(null);

      const cart = await cartService.viewCart(1);

      expect(cart).toBeNull();
      expect(viewFindCartWithProducts).toHaveBeenCalledWith(1);
    });
  });

  describe("updateCart", () => {
    it("should update the quantity of a product in the cart", async () => {
      // Mocking the cart query functions
      (findCartWithProducts as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        products: [{ id: 1, productId: 123, quantity: 2 }],
      }); // Mock existing cart
      (updateCartItemQuantity as jest.Mock).mockResolvedValue(true); // Mock updating cart item quantity

      const cart = await cartService.updateCart(1, 123, 3);

      expect(cart).toBeTruthy();
      expect(findCartWithProducts).toHaveBeenCalledWith(1);
      expect(updateCartItemQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("should throw an error when the cart does not exist", async () => {
      // Mocking the cart query functions
      (findCartWithProducts as jest.Mock).mockResolvedValue(null); // Mock cart not found

      await expect(cartService.updateCart(1, 123, 3)).rejects.toThrow(
        "Cart not found for user"
      );

      expect(findCartWithProducts).toHaveBeenCalledWith(1);
    });

    // Add more test cases for different scenarios (e.g., when the product is not found in the cart)
  });

  describe("removeFromCart", () => {
    it("should remove a product from the cart", async () => {
      // Mocking the cart query functions
      (findCartWithProducts as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        products: [{ id: 1, productId: 123, quantity: 2 }],
      }); // Mock existing cart
      (deleteCartItem as jest.Mock).mockResolvedValue(true); // Mock deleting cart item

      const cart = await cartService.removeFromCart(1, 123);

      expect(cart).toBeTruthy();
      expect(findCartWithProducts).toHaveBeenCalledWith(1);
      expect(deleteCartItem).toHaveBeenCalledWith(1);
    });

    it("should throw an error when the cart does not exist", async () => {
      // Mocking the cart query functions
      (findCartWithProducts as jest.Mock).mockResolvedValue(null); // Mock cart not found

      await expect(cartService.removeFromCart(1, 123)).rejects.toThrow(
        "Cart not found for user"
      );

      expect(findCartWithProducts).toHaveBeenCalledWith(1);
    });

    it("should throw an error when the product is not found in the cart", async () => {
      // Mocking the cart query functions
      (findCartWithProducts as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        products: [{ id: 1, productId: 456, quantity: 2 }],
      }); // Mock existing cart

      await expect(cartService.removeFromCart(1, 123)).rejects.toThrow(
        "Product not found in the cart"
      );

      expect(findCartWithProducts).toHaveBeenCalledWith(1);
    });
  });
});
