import mongoose, { model, Schema } from "mongoose";

const subCateg = new Schema(
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const subCategory = mongoose.models.subCategory || model("subCategory", subCateg);
export default subCategory;