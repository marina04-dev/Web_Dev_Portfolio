import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkWebHooks, stripeWebHooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

// initialize express
const app = express();

const port = process.env.PORT || 4000;

// connect to the database
await connectDB();
// connect to cloudinary
await connectCloudinary();

// middlewares
app.use(cors());
app.use(clerkMiddleware());

// default route
app.get("/", (req, res) => res.send("API Is Working Successfully!"));

// clerk webhook
app.post("/clerk", express.json(), clerkWebHooks);

// educator routes
app.use("/api/educator", express.json(), educatorRouter);
// course routes
app.use("/api/course", express.json(), courseRouter);
// user routes
app.use("/api/user", express.json(), userRouter);

// POST: stripe webhooks payment route
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

app.listen(port, () => {
  console.log(`Server Is Successfully Running On Port ${port}!`);
});
