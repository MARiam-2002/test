import jwt from "jsonwebtoken";

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object (must include _id)
 * @returns {string} - JWT token
 */

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin }, // payload
    process.env.JWT_SECRET, // secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // expiration
  );
};
