import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary credentials:");
console.log(
  "Cloud name:",
  process.env.CLOUDINARY_CLOUD_NAME ? "✓ Found" : "❌ Missing"
);
console.log(
  "API key:",
  process.env.CLOUDINARY_API_KEY ? "✓ Found" : "❌ Missing"
);
console.log(
  "API secret:",
  process.env.CLOUDINARY_API_SECRET ? "✓ Found" : "❌ Missing"
);

export const uploadSingleImage = async (file, folder = "hedaya") => {
  try {
    if (!file) return;
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    //   upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "auto",
    });

    // response from cloudinary

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.log("cloudinary upload error", error);
    throw new Error(`failed to upload image: ${error.message}`);
  }
};

export const uploadMultipleImage = async (files, folder = "hedaya") => {
  try {
    if (!files || !files.length) return;
    let results = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadSingleImage(files[i], folder);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        throw new Error(`failed to upload image ${i}: ${error.message}`);
      }
    }
    return results;
  } catch (error) {
    console.log("cloudinary upload error", error);
    throw new Error(`failed to upload image: ${error.message}`);
  }
};

export const deleteImage = async (public_Id) => {
  try {
    if (!public_Id) {
      throw new Error("public ID is required");
    }
    const result = await cloudinary.uploader.destroy(public_Id);
    return {
      success: result.result === "ok",
      message:
        result.result === "ok"
          ? "Image deleted successfully"
          : "Image not found",
      public_Id: public_Id,
    };
  } catch (error) {
    console.log("cloudinary delete error", error);
    throw new Error(`failed to delete image: ${error.message}`);
  }
};
export const deleteMultipleImages = async (public_Ids) => {
  try {
    if (!public_Ids || !public_Ids.length) return [];
    const results = [];
    for (let i = 0; i < public_Ids.length; i++) {
      try {
        const result = await deleteImage(i);
        results.push(result);
      } catch (error) {
        return {
          success: false,
          message: error.message,
          public_Id: i,
        };
      }
    }
    return results;
  } catch (error) {
    console.log("cloudinary delete multi error", error);
    throw new Error(`failed to delete images: ${error.message}`);
  }
};

export async function handleImageUpdate(newImageFile, existingDoc) {
  // Upload new image
  const newImage = await uploadSingleImage(newImageFile, "hedaya/categories");

  // Delete old image if it exists
  if (existingDoc.image && existingDoc.image.id) {
    try {
      await deleteImage(existingDoc.image.id);
    } catch (error) {
      console.log("error at delete image", error);
    }
  }

  return newImage;
}
