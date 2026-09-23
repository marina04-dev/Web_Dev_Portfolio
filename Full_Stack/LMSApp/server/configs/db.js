import mongoose from "mongoose";

// connect to mongodb atlas database
const connectDB = async () => {
  // listen to connection event
  mongoose.connection.on("connected", () =>
    console.log("MongoDB Database Connected Successfully!")
  );
  // establish the connection
  await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
};

export default connectDB;
