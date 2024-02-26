import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import authRoutes from "./presentation/routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./presentation/routes/productRoutes";

import cartRoutes from "./presentation/routes/cartRoutes";
import userRoutes from "./presentation/routes/userRoutes";
import orderHistoryRoutes from "./presentation/routes/orderHistoryRoutes";

import logger from "./presentation/utils/logger";
import ErrorHandlerMiddleware from "./presentation/middlewares/errorMiddleware";
import { setupSwagger } from "./presentation/utils/swaggerDocx/swagger";


dotenv.config();
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

setupSwagger(app)

app.use("/auth", authRoutes);
app.use("/", productRoutes);
app.use("/cart", cartRoutes);
app.use("/user", userRoutes);
app.use("/", orderHistoryRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  ErrorHandlerMiddleware(err, req, res, next);
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
