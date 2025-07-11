import mongoose from "mongoose";

// database connection
const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("MongoDB Database Connected Successfully!")
  );
  await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
};

export default connectDB;
