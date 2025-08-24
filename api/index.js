import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, NotFound } from "../src/middlewares/errorHandler.js";
import { registerRoute } from "../src/routes/auth.js";
import { categRoute } from "../src/routes/category.js";
import { productRoute } from "../src/routes/product.js";
import { subCateg } from "../src/routes/subCategory.js";
import { passRoute } from "../src/routes/password.js";
import { connectDB } from "../src/config/db.js";
import { userRoute } from "../src/routes/user.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for Vercel compatibility
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("combined"));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

// Static files - Note: Vercel handles static files differently
app.use("/images", express.static(path.join(__dirname, "../images")));

// Database connection middleware for serverless
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// Routes
app.use("/api/auth", registerRoute);
app.use("/api/password", passRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categRoute);
app.use("/api/subcategories", subCateg);
app.use("/api/products", productRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    environment: "Vercel Serverless",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Hedaya API - Vercel Serverless",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      categories: "/api/categories",
      subcategories: "/api/subcategories",
      products: "/api/products",
      password: "/api/password",
    },
  });
});

// Error handling (should be last)
app.use(NotFound);
app.use(errorHandler);

export default app;
