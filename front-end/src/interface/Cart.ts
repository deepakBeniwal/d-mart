export interface CartProduct {
    price: any;
    productId: number;
    quantity: number;
    productName: string;
    productDescription: string;
  }

  export interface CartItem {
    productId: number;
    quantity: number;
    productName: string;
    productDescription: string;
    price: number;
  }
  