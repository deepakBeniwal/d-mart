import express from "express";
import { checkAccessToken } from "../middlewares/authMiddleware";

import {
  getPurchaseHistoryController,
  getPurchaseByIdController,
} from "../controllers/order.controller";

const router = express.Router();

router.get("/purchase-history", checkAccessToken, getPurchaseHistoryController);
router.get(
  "/purchase-history/:id",
  checkAccessToken,
  getPurchaseByIdController
);

export default router;
