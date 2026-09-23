import mongoose from "mongoose";

// function connect to the database
export const connectDB = async () => {
  // connect to the database promise
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Database Connected Successfully!"));
};
