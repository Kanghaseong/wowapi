import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function db_connect() {
  try {
    await mongoose.connect(`mongodb+srv://hagota:${process.env.MONGO_PASSWORD}@gachacluster.nptwd2a.mongodb.net/`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
