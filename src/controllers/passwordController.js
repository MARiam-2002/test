import expressAsyncHandler from "express-async-handler";
import  User  from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const forgetPassword = expressAsyncHandler(async (req, res) => {
  res.render("forget-password");
});

export const sendForgetPassword = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, {
    expiresIn: "10m",
  });

  const baseUrl =
    process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 5001}`;
  const link = `${baseUrl}/api/password/reset-password/${user._id}/${token}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html: `
        <div>
          <h4>click the link below to reset your password</h4>
          <p>${link}</p>
        </div>
    `,
  };

  transport.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "failed to send email " });
    } else {
      console.log("email send " + success.response);
      res.render("link-send");
    }
  });
});

export const getResetPassword = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;

  try {
    jwt.verify(req.params.token, secret);
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    await user.save();
    res.render("success");
  } catch (error) {
    console.error("Token verification failed:", error);
    res
      .status(400)
      .json({ message: "Invalid or expired token", error: error.message });
  }
});
