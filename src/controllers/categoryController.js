import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import {
  deleteImage,
  handleImageUpdate,
  uploadSingleImage,
} from "../services/cloudinaryService.js";
import Category from "../models/Category.js";

export const createCategory = expressAsyncHandler(async (req, res) => {
  let image = null;
  if (req.files && req.files.image) {
    image = await uploadSingleImage(req.files.image[0], "hedaya/categories");
  }
  const categ = new Category({
    name: req.body.name,
    description: req.body.description,
    slug: slugify(req.body.name),
    image,
    createdBy: req.body.createdBy,
  });
  const savedCateg = await categ.save();
  res.status(201).json({ message: "category created", result: savedCateg });
});

export const getAllCategories = expressAsyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;
  let categ;
  if (page && limit) {
    categ = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("createdBy");
  } else {
    categ = await Category.find().sort({ createdAt: -1 }).populate("createdBy");
  }
  res.status(201).json(categ);
});

export const getSingleCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const categ = await Category.findById(id);
  if (!categ) {
    res.status(404).json({ message: "category not found" });
  } else {
    res.status(200).json(categ);
  }
});

export const updateCategeory = expressAsyncHandler(async (req, res) => {
  const exist = await Category.findById(req.params.id);
  if (!exist) {
    res.status(404).json({ message: "category not found" });
  }

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name || exist.name,
        description: req.body.description || exist.description,
        // Only include slug if name is changing
        ...(req.body.name ? { slug: slugify(req.body.name) } : {}),
        // Only include image if a new one is uploaded
        ...(req.files?.image
          ? { image: await handleImageUpdate(req.files?.image[0], exist) }
          : {}),
      },
    },
    { new: true }
  );
  res.status(200).json({ message: "category updated", result: updated });
});

export const deleteCategory = expressAsyncHandler(async (req, res) => {
  const exist = await Category.findByIdAndDelete(req.params.id);
  if (!exist) {
    res.status(404).json({ message: "category not found" });
  }
  res.status(200).json({ message: "category deleted successfully" });
});
