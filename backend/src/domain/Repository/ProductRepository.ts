import { Product } from "../entities/Product";

export interface ProductRepository {
  addProduct(
    name: string,
    description: string,
    price: number,
    categoryName: string,
    categoryDescription: string
  ): Promise<Product | undefined>;

  getAllProducts(
    page: number,
    pageSize: number
  ): Promise<Product[] | undefined>;

  getProductsByCategory(categoryId: number): Promise<Product[] | undefined>;

  getProductById(id: number): Promise<Product | undefined>;

  getCategories(): Promise<Product[] | undefined>;
}
