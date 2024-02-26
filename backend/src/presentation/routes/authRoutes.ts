import express from "express";
import {
  loginUser,
  registerUser,
  confirmUser,
  deleteUserAccount,
} from "../controllers/cognito.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/confirm", confirmUser);
router.post("/delete", deleteUserAccount);

export default router;
