import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConfigModel from "@/types/config";
import { getUserFromToken } from "@/app/actions";
import { cookies } from "next/headers";
import { User } from "lucide-react";
import UserModel from "@/types/user";
import jwt from "jsonwebtoken";
import Connection from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST - Create new config
export async function POST(request: Request) {
  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    const token = (await cookies()).get("token")?.value;
    console.log("token in /api/configs", token);

    if (!token) {
      console.log("Unauthorized!!!", token);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode the token to extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };

    const userId = new ObjectId(decoded._id);
    // Parse the request body
    const body = await request.json();

    // Create a new configuration
    const newConfig = new ConfigModel({
      ...body,
      user_id: userId, // Associate the config with the user
    });

    // Save the configuration to the database
    await newConfig.save();

    // const user = await getUserFromToken();
    // const data = await request.json();

    // // Create new config with converted user ID
    // const newConfig = await ConfigModel.create({
    //   ...data,
    //   user_id: new mongoose.Types.ObjectId(user._id), // Convert string ID to ObjectId
    // });

    return NextResponse.json(newConfig, { status: 201 });
  } catch (error) {
    console.error("Config creation error:", error); // Add detailed error logging
    return NextResponse.json(
      {
        error: "Failed to create config",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Connect to MongoDB
    await Connection();

    // Get the user token from cookies (or adapt based on your auth system)
    const token = (await cookies()).get("token")?.value;
    console.log("token in /api/configs", token);

    if (!token) {
      console.log("Unauthorized!!!", token);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode the token to extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    console.log("decoded", decoded);
    if (!decoded?._id) {
      console.log("!decoded?.userId", decoded);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = new ObjectId(decoded._id);

    // Fetch configurations for the user
    const allconfigs = await ConfigModel.find().lean();
    console.log("all configs: ", allconfigs);
    console.log("userID : ", userId);
    const configs = await ConfigModel.find({ user_id: userId }).lean();

    // Frontend Response (Sending Data to Client)
    const serializedConfigs = configs.map((config) => ({
      ...config,
      _id: config._id?.toString(), // Convert to string for frontend
      user_id: config.user_id.toString(),
    }));
    console.log("serializedConfigs", serializedConfigs);

    return NextResponse.json(serializedConfigs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch configurations" },
      { status: 500 }
    );
  }
}
