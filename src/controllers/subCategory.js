import expressAsyncHandler from "express-async-handler";
import subCategory from "../models/subCategory.js";
import slugify from "slugify";

export const createSubCateg = expressAsyncHandler(async (req, res) => {
  const subFields = new subCategory({
    name: req.body.name,
    description: req.body.description,
    slug: slugify(req.body.name),
    category: req.body.category,
  });
  const saved = await subFields.save();
  res.status(201).json({ message: "subCategory created", result: saved });
});

export const getAllSubCateg = expressAsyncHandler(async (req, res) => {
  const subs = await subCategory.find().sort({ createdAt: -1 });
  res.status(200).json(subs);
});
