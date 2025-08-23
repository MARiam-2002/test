import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/usersController.js";
import {
  verifyAdminAndAuthorized,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";
export const userRoute = express.Router();

userRoute.route("/").get(verifyTokenAndAdmin, getAllUsers);

userRoute
  .route("/:id")
  .get(verifyAdminAndAuthorized, getSingleUser)
  .put(verifyAdminAndAuthorized, updateUser)
  .delete(verifyAdminAndAuthorized, deleteUser);
