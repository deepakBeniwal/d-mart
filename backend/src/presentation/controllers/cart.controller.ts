import { Request, Response } from "express";
import cartService from "../../application/cart.service";
import { Cart } from "../../domain/entities/Cart";

export const addToCartController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const result: Cart | null = await cartService.addToCart(
      userId,
      productId,
      quantity
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
};

export const viewCartController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    const result: Cart | null = await cartService.viewCart(userId);

    if (result) {
      const cartDetails = {
        userId: result.userId,
        user: {
          id: req.user.id,
          email: req.user.email,
        },
        products: result.products?.map((cartItem) => ({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          productName: cartItem.product.name,
          productDescription: cartItem.product.description,
          price: cartItem.product.price,
        })),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      // Return the cart details as JSON
      res.status(200).json(cartDetails);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error viewing cart" });
  }
};

export const updateCartController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId, 10);
  const { quantity } = req.body;

  try {
    const result: Cart | null = await cartService.updateCart(
      userId,
      productId,
      quantity
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

export const removeFromCartController = async (
  req: Request | any,
  res: Response
): Promise<void> => {
  const userId = req.user.id;
  const productId = parseInt(req.params.productId, 10);

  try {
    const result: Cart | null = await cartService.removeFromCart(
      userId,
      productId
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing product from cart" });
  }
};
