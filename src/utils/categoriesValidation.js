import Joi from "joi";
import { imageJoi } from "./productValidation.js";

export const categoryValidator = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(1000).allow(""),
  image: imageJoi.optional(),
  createdBy: Joi.string().hex().length(24).required(),
});
export const updateCategoryValidator = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  description: Joi.string().max(1000).allow("").optional(),
  image: imageJoi.optional(),
  createdBy: Joi.string().hex().length(24).optional(),
});

export const subCategoriesValidator = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(1000).allow(""),
  category: Joi.string().hex().required(),
});
