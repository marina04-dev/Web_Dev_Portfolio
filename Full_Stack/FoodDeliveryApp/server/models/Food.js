import mongoose from "mongoose";

// create the food schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

// create food model
const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;
