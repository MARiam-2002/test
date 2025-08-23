import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategeory,
} from "../controllers/categoryController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
  categoryValidator,
  updateCategoryValidator,
} from "../utils/categoriesValidation.js";
import { verifyTokenAndAdmin } from "../middlewares/verifyToken.js";
export const categRoute = express.Router();

const categoryUpload = upload.fields([{ name: "image", maxCount: 1 }]);

categRoute
  .route("/")
  .get(getAllCategories)
  .post(validate(categoryValidator), categoryUpload, createCategory);

categRoute
  .route("/:id")
  .get(getSingleCategory)
  .patch(
    categoryUpload,
    validate(updateCategoryValidator),
    verifyTokenAndAdmin,
    updateCategeory
  )
  .delete(verifyTokenAndAdmin, deleteCategory);
