import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connections && mongoose.connections[0].readyState) return;
    
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI! as string
    );

    console.log("Connected to MongoDB: ", connection.host);
  } catch (error) {
    throw new Error(
      "Error connecting to database",
      error || "Something went wrong"
    );
  }
};

export default connectDB;
