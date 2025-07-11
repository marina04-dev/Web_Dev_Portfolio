import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

const port = process.env.PORT || 4000;

// connect to database
connectDB();

// allowed origins for cors configuration (frontend url)
const allowedOrigins = ["http://localhost:5173"];

// parse json responses
app.use(express.json());
// cookie saving
app.use(cookieParser());
// requests from other networks with cookie/credentials and add the frontend link also
app.use(cors({ origin: allowedOrigins, credentials: true }));

// api endpoints
app.get("/", (req, res) => {
  res.send("API Is Working Successfully!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server Is Successfully Running On Port ${port}!`);
});
