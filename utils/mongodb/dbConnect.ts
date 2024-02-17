import mongoose from "mongoose";
import Country from "./models/Country";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    // Fetch the models after connection established to ensure that all models are attached to the connection
    Country;
  } catch (error) {
    throw new Error("MongoDB connection error: " + error);
  }
};

export default connect;
