export interface UserPurchaseHistory {
    id: number;
    totalItems: number;
    totalPrice: number;
    createdAt: string;
    products: {
      id: number;
      productId: number;
      purchaseHistoryId: number;
      quantity: number;
      price: number;
      createdAt: string;
      updatedAt: string;
      product: {
        id: number;
        name: string;
        description: string;
        price: number;
        createdAt: string;
        updatedAt: string;
        categoryId: number;
      };
    }[];
  }