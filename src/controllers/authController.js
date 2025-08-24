import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
/**
 * @description Register new user
 * @method      POST
 * @route       /api/auth/register
 * @access      Public
 */

export const registerUser = expressAsyncHandler(async (req, res) => {
  const existUser = await User.findOne({ email: req.body.email });

  if (existUser) {
    return res.status(400).json({ message: "user alreay exist with email" });
  }

  // hashing password
  const salt = await bcrypt.genSalt(10);
  const hashPas = await bcrypt.hash(req.body.password, salt);
  // new user
  const user = new User({
    email: req.body.email,
    userName: req.body.userName,
    password: hashPas,
  });
  const savedUser = await user.save();

  // remove password
  const { password, ...userWithoutPass } = savedUser._doc;

  res.status(201).json({
    message: "user created",
    user: userWithoutPass,
    token: generateToken(user),
  });
});

/**
 * @description Login user
 * @method      POST
 * @route       /api/auth/login
 * @access      Public
 */

export const loginUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  // check password
  const isPassValid = await bcrypt.compare(req.body.password, user.password);

  if (!isPassValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const { password, ...userWithoutPass } = user._doc;

  res.status(201).json({
    message: "logged in",
    user: userWithoutPass,
    token: generateToken(user),
  });
});
