import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { loginValidator, registerValidator } from "../utils/validators.js";

export const registerRoute = express.Router();

registerRoute.post("/register", validate(registerValidator), registerUser);
registerRoute.post("/login", validate(loginValidator), loginUser);
