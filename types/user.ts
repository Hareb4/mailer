import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// TypeScript interface for the User type
export interface MongoUser {
  _id?: string;
  name: string;
  email: string;
  profile_image_url?: string;
}

// Mongoose schema and model for MongoDB interaction
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_image_url: {
      type: String,
    },
  },
  { collection: "users" }
);

const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

export default UserModel; // Default export for the Mongoose model
