import mongoose from "mongoose";

// function to connect to the mongodb database
const connectDB = async () => {
  // connection event listen
  mongoose.connection.on("connected", () => {
    console.log(`MongoDB Database Connected Successfully!`);
  });
  // connect database
  await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);
};

export default connectDB;
