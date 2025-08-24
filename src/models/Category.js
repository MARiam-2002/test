import mongoose, { model, Schema } from "mongoose";
import { imageSchema } from "./shared/imageSchema.js";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true, // useful for SEO URLs
    },
    image: {
      type: imageSchema,
      required: false, // optional
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Category = mongoose.models.Category || model("Category", categorySchema);
export default Category;