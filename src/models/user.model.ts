import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    Selection: false,
  },
  googleId: {
    type: String,
  },
  isVerified: {
    type: String,
    default: false,
  },
});

export const User =
  mongoose.models?.users || mongoose.model("users", userSchema);
