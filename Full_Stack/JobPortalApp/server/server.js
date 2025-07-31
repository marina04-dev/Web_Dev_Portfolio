import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import "./configs/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebHooks } from "./controllers/webhooks.js";
import companyRouter from "./routes/companyRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

// initialize express
const app = express();

// database connection
await connectDB();

// cloudinary connection
await connectCloudinary();

// middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// routes
app.get("/", (req, res) => res.send("API Is Working Successfully!"));
app.post("/webhooks", clerkWebHooks);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/user", userRouter);

// port
const port = process.env.PORT || 5000;

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.listen(port, () => {
  console.log(`Server Is Successfully Running On Port ${port}!`);
});
