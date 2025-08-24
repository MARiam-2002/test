import { Schema } from "mongoose";

// models/shared/imageSchema.js
export const imageSchema = new Schema(
  {
    id: { type: String, required: true }, // Cloudinary public_id
    url: { type: String, required: true }, // Cloudinary URL
  },
  { _id: false, id: false }
);
