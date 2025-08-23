import express from "express";
import {
  forgetPassword,
  getResetPassword,
  resetPassword,
  sendForgetPassword,
} from "../controllers/passwordController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { changePassword } from "../utils/validators.js";
export const passRoute = express.Router();

passRoute
  .route("/forget-password")
  .get(forgetPassword)
  .post(sendForgetPassword);
passRoute
  .route("/reset-password/:id/:token")
  .get(getResetPassword)
  .post(validate(changePassword), resetPassword);
