export interface PurchaseHistory {
    id: number;
    userId: number;
    totalItems: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    products: PurchaseHistoryProduct[];
  }
  
  export interface PurchaseHistoryProduct {
    productId: number;
    quantity: number;
    price: number;
  }
  