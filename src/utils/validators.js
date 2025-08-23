import Joi from "joi";

export const registerValidator = Joi.object({
  userName: Joi.string().min(3).max(100).required().messages({
    "string.base": "userName must be a text",
    "string.empty": "userName is required",
    "string.min": "userName must be at least 3 characters",
    "string.max": "userName must be less than 50 characters",
    "any.required": "userName is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});
export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const changePassword = Joi.object({
  password: Joi.string().min(6).required(),
});
