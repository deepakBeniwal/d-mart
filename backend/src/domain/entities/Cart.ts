export interface CartItem {
    product: any;
    id: number;
    productId: number;
    quantity: number;
  }
  
  export interface Cart {
    userId: number;
    products?: CartItem[]; // Making products optional
    createdAt: Date;
    updatedAt: Date;
  }
  