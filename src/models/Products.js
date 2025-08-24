import mongoose, { model, Schema } from "mongoose";
import { imageSchema } from "./shared/imageSchema.js";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },

    price: { type: Number, required: true, min: 0 }, // e.g. 70
    discount: { type: Number, default: 0, min: 0, max: 100 }, // e.g. 11 -> 11%

    favourite: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["new", "used", "out_of_stock"],
      default: "new",
    },

    availableItems: { type: Number, required: true, min: 0 }, // e.g. 12

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    defaultImage: { type: imageSchema, required: true },
    images: { type: [imageSchema], default: [] }, // array of images
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);
// calculate finalPrice
productsSchema.virtual("finalPrice").get(function () {
  const p = this.price || 0;
  const d = this.discount || 0;
  const val = p * (1 - d / 100);
  return val.toFixed(2);
});

const Product = mongoose.models.Product || model("Product", productsSchema);
export default Product;