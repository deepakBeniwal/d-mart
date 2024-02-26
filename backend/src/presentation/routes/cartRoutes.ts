import express from "express";
import {
  addToCartController,
  viewCartController,
  updateCartController,
  removeFromCartController,
} from "../controllers/cart.controller";
import { checkAccessToken } from "../middlewares/authMiddleware";
import { checkoutController } from "../controllers/order.controller";

const router = express.Router();

router.post("/add-to-cart", checkAccessToken, addToCartController);
router.get("/view-cart", checkAccessToken, viewCartController);
router.put("/update-cart/:productId", checkAccessToken, updateCartController);
router.delete(
  "/remove-from-cart/:productId",
  checkAccessToken,
  removeFromCartController
);
router.post("/checkout", checkAccessToken, checkoutController);

export default router;
