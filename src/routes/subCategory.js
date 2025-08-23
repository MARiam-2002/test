import express from "express";
import { createSubCateg, getAllSubCateg } from "../controllers/subCategory.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { subCategoriesValidator } from "../utils/categoriesValidation.js";

export const subCateg = express.Router();

subCateg
  .route("/")
  .get(getAllSubCateg)
  .post(validate(subCategoriesValidator), createSubCateg);

