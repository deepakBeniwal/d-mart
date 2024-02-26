import axios from "axios";
import { baseURL } from "../config/apiConfig";

export const fetchCartProducts = async (accessToken: string | null) => {
  try {
    const response = await axios.get(`${baseURL}/cart/view-cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart products:", error);
    throw error;
  }
};

export const checkoutProducts = async (accessToken: string | null, userId: number, products: any[]) => {
  try {
    const checkoutPayload = {
      userId: userId,
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      })),
    };
    await axios.post(`${baseURL}/cart/checkout`, checkoutPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    throw error;
  }
};




  export const addToCart = async (
    productId: number,
    quantity: number,
    accessToken: string | null
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/cart/add-to-cart`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      throw error;
    }
  };