// Users\WEB\Desktop\hedaya\src\controllers\productController.js
import expressAsyncHandler from "express-async-handler";
import Product from "../../src/models/Products.js";
import {
  deleteImage,
  deleteMultipleImages,
  handleImageUpdate,
  uploadMultipleImage,
  uploadSingleImage,
} from "../services/cloudinaryService.js";
import { productValidator } from "../utils/productValidation.js";
import slugify from "slugify";
import mongoose from "mongoose";
// import { productValidator } from "../utils/productValidation.js";

export const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    // Extract data from req.body
    const {
      name,
      description,
      price,
      discount,
      favourite,
      status,
      availableItems,
      category,
      subCategory,
    } = req.body;

    // Get user by token
    const createdBy = req.user.id;

    let defaultImage = null;
    let images = [];

    // Handle file uploads
    if (req.files && req.files.defaultImage) {
      defaultImage = await uploadSingleImage(
        req.files.defaultImage[0],
        "hedaya/products"
      );
    }

    if (req.files && req.files.images) {
      images = await uploadMultipleImage(req.files.images, "hedaya/products");
    }

    // Create product data object
    const productData = {
      name,
      description,
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      favourite: favourite === "true",
      status: status || "new",
      availableItems: parseInt(availableItems),
      category,
      subCategory,
      createdBy,
      defaultImage,
      images,
    };

    // Validate the product data
    const { error } = productValidator.validate(productData);

    if (error) {
      // Clean up uploaded images if validation fails
      if (defaultImage) await deleteImage(defaultImage.id);
      if (images.length > 0) {
        const imageIds = images.map((img) => img.id);
        await deleteMultipleImages(imageIds);
      }

      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }

    // Create and save product
    const newProd = new Product(productData);
    const savedProduct = await newProd.save();

    res.status(201).json({
      status: "success",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export const getAllProd = expressAsyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;

  let products;

  if (page && limit) {
    products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  } else {
    products = await Product.find().sort({ createdAt: -1 });
  }
  res.status(200).json(products);
});

export const getSingleProd = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate id format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid product id" });
  }

  const exist = await Product.findById(id)
    .populate("category", "name ")
    .populate("subCategory", "name ")
    .populate("createdBy", "userName email");

  if (!exist) {
    return res
      .status(404)
      .json({ status: "fail", message: "Product not found" });
  }

  return res.status(200).json({ status: "success", data: exist });
});

export const updateProduc = expressAsyncHandler(async (req, res) => {
  const exist = await Product.findById(req.params.id);
  if (!exist) {
    res.status(404).json({ status: "fail", message: "Product not found" });
  }
  const updateObj = {};

  if (req.body.name && req.body.name.trim() !== "") {
    updateObj.name = req.body.name;
    updateObj.slug = slugify(req.body.name);
  }

  if (req.body.description !== undefined)
    updateObj.description = req.body.description;
  if (req.body.price !== undefined)
    updateObj.price = parseFloat(req.body.price);
  if (req.body.discount !== undefined)
    updateObj.discount = parseFloat(req.body.discount);
  if (req.body.favourite !== undefined)
    updateObj.favourite =
      req.body.favourite === "true" || req.body.favourite === true;
  if (req.body.status !== undefined) updateObj.status = req.body.status;
  if (req.body.availableItems !== undefined)
    updateObj.availableItems = parseInt(req.body.availableItems, 10);
  if (req.body.category !== undefined) updateObj.category = req.body.category;
  if (req.body.subCategory !== undefined)
    updateObj.subCategory = req.body.subCategory;

  if (req.files?.defaultImage[0]) {
    const newone = await handleImageUpdate(req.files.defaultImage[0], exist);
    updateObj.defaultImage = newone;
  }

  if (req.files.images && req.files.length > 0) {
    const newImages = await uploadMultipleImage(
      req.files.images,
      "hedaya/products"
    );
    if (Array.isArray(exist.images) && exist.images.length > 0) {
      const ids = exist.map((x) => x?.id).filter(Boolean);
      if (ids) {
        await deleteMultipleImages(ids);
      }
    }
    updateObj.images = newImages;
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: updateObj,
    },
    { new: true, runValidators: true }
  ).populate("");
  res.status(200).json({ message: "product updated", result: updated });
});

export const deleteProduct = expressAsyncHandler(async (req, res) => {
  const exist = await Product.findByIdAndDelete(req.params.id);
  if (!exist) {
    res.status(404).json({ message: "product not found" });
  }
  res.status(200).json({ message: "product deleted" });
});
