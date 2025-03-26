import mongoose, { Model } from "mongoose";
import { ObjectId } from "mongodb";

// TypeScript interface for the Config type
export interface Config {
  _id?: ObjectId;
  user_id: ObjectId; // Reference to the User's ObjectId
  name: string;
  from_email: string;
  smtp_server: string;
  smtp_port: number;
  smtp_email: string;
  smtp_password: string;
}

// Mongoose schema and model for MongoDB interaction
const configSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    from_email: {
      type: String,
      required: true,
    },
    smtp_server: {
      type: String,
      required: true,
    },
    smtp_port: {
      type: Number,
      required: true,
    },
    smtp_email: {
      type: String,
      required: true,
    },
    smtp_password: {
      type: String,
      required: true,
    },
  },
  { collection: "configurations" }
);

// Export the Mongoose model for runtime use

// const ConfigModel =
//   mongoose.models.config || mongoose.model("config", configSchema);

// Handle model creation safely for Next.js environment
let ConfigModel: Model<Config>;

try {
  ConfigModel = mongoose.model<Config>("config");
} catch {
  ConfigModel = mongoose.model<Config>("config", configSchema);
}

// Default export for when model is initialized (ensure this happens in async manner)
export default ConfigModel;
