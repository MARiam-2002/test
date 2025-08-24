import expressAsyncHandler from "express-async-handler";
import  User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export const getSingleUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "user not found" });
  }
  res.status(200).json(user);
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = bcrypt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password,
    },
  });
  if (!user) {
    res.status(404).json({ message: "user not found" });
  }

  const token = generateToken(user);

  res
    .status(200)
    .json({ message: "user updated successfully", result: user, token: token });
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ message: "user not found" });
  }
  res.status(200).json({ message: "user deleted" });
});
