import Joi from "joi";

export const imageJoi = Joi.object({
  id: Joi.string().trim().required(),
  url: Joi.string().uri().required(),
});

export const productValidator = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(2000).required(),

  price: Joi.number().positive().precision(2).required(),
  discount: Joi.number().min(0).max(100).default(0),

  favourite: Joi.boolean().default(false),
  status: Joi.string().valid("new", "used", "out_of_stock").default("new"),

  availableItems: Joi.number().integer().min(0).required(),
  soldItems: Joi.number().integer().min(0).default(0),

  category: Joi.string().hex().length(24).required(),
  subCategory: Joi.string().hex().length(24).required(),
  createdBy: Joi.string().hex().length(24).required(),
  defaultImage: imageJoi.required(),
  images: Joi.array().items(imageJoi).min(1).required(),
});

export const productUpdateValidator = Joi.object({
  name: Joi.string().min(2).max(120),
  description: Joi.string().max(2000),

  price: Joi.number().positive().precision(2),
  discount: Joi.number().min(0).max(100).default(0),

  favourite: Joi.boolean().default(false),
  status: Joi.string().valid("new", "used", "out_of_stock").default("new"),

  availableItems: Joi.number().integer().min(0),
  soldItems: Joi.number().integer().min(0).default(0),

  category: Joi.string().hex().length(24),
  subCategory: Joi.string().hex().length(24),
  createdBy: Joi.string().hex().length(24),

  defaultImage: imageJoi,
  images: Joi.array().items(imageJoi).min(1),
});
