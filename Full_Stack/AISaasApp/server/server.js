import express from "express";
import cors from "cors";
import "dotenv/config.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// error handling while connecting to cloudinary
try {
  await connectCloudinary();
  console.log("Cloudinary Connected Successfully!");
} catch (error) {
  console.error("Failed To Connect To Cloudinary:", error);
}

// CORS configuration for better security
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Set frontend URL in env
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // URL encoded support
app.use(clerkMiddleware());

const port = process.env.PORT || 4000;

// basic health check route before auth
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Is Working Successfully!",
    timestamp: new Date().toISOString(),
  });
});

// health check route that doesn't require auth
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server Is Healthy",
    timestamp: new Date().toISOString(),
  });
});

// apply authentication middleware to protected routes
app.use("/api", requireAuth);

app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "Development" && { error: error.message }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.listen(port, () => {
  console.log(`Server Is Successfully Listening On Port ${port}!`);
  console.log(`Environment: ${process.env.NODE_ENV || "Development"}`);
});
