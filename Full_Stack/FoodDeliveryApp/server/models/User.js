import mongoose from "mongoose";

// create the user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

// create user model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
