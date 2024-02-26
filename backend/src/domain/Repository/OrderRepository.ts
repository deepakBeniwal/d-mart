import { PurchaseHistory } from "../entities/Order";

export interface OrderRepository {
  checkout(userId: number): Promise<PurchaseHistory | null>;
  getPurchaseHistory(userId: number): Promise<PurchaseHistory[] | null>;
  getPurchaseById(id: number): Promise<PurchaseHistory | null>;
}
