// user.routes.ts
import express from "express";
import { getUserDetailsByCognitoSub } from "../controllers/cognito.controller";

const router = express.Router();

router.get("/:cognitoSub", getUserDetailsByCognitoSub);

export default router;
