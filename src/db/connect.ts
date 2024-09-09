import mongoose from "mongoose";
import 'dotenv/config';

const dbConnect = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log("MongoDB connected successfully...");
  }
  catch(error) {
    console.log("Failed to connect to MongoDB ", error)
  }
}

export default dbConnect;