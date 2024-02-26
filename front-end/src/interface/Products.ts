export interface Products {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: {
      id: number;
      name: string;
      description: string;
    };
  }

 export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }
  