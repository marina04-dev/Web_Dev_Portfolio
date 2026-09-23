import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

// app configuration
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// database configuration
connectDB();

// api endpoints
app.use("/api/food", foodRouter); // api endpoint for food operations
app.use("/images", express.static("uploads")); // api endpoint for images operations
app.use("/api/user", userRouter); // api endpoint for user operations
app.use("/api/cart", cartRouter); // api endpoint for user's cart operations
app.use("/api/order", orderRouter); // api endpoint for user's orders operations

// basic route
app.get("/", (req, res) => res.send("API Is Working Successfully!"));

app.listen(port, () => {
  console.log(`Server Is Listening On Port http://localhost:${port}`);
});
