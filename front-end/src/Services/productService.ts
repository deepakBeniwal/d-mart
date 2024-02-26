// src/services/productService.ts
import axios from "axios";
import { baseURL } from "../config/apiConfig";

export const getAllProducts = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const response = await axios.get(`${baseURL}/products/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductsByCategory = async (accessToken: string, categoryId: number) => {
  try {
    const response = await axios.get(`${baseURL}/products/byCategory/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};


export const fetchProductDetails = async (id: string | undefined, accessToken: string | null) => {
  try {
    const response = await axios.get(`${baseURL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};