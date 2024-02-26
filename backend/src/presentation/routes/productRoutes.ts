import express from "express";
import { checkAccessToken } from "../middlewares/authMiddleware";
import {  addProductController , getAllProductsController , getProductsByCategoryController , getProductByIdController , getCategoriesController} from "../controllers/product.controller";

const router = express.Router();

router.post("/products/add", addProductController);
router.get(
  "/products/all",
  checkAccessToken,
  getAllProductsController
);
router.get(
  "/products/byCategory/:categoryId",
  getProductsByCategoryController
);
router.get("/products/:id", getProductByIdController);
router.get("/categories", getCategoriesController); // Add this line

export default router;
