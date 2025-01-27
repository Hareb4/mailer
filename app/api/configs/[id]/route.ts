import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConfigModel from "@/types/config";
import { getUserFromToken } from "@/app/actions";

// PUT - Update config
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    const data = await request.json();

    const updatedConfig = await ConfigModel.findOneAndUpdate(
      { _id: params.id, user_id: user._id },
      data,
      { new: true }
    );

    if (!updatedConfig) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    return NextResponse.json(updatedConfig);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update config" },
      { status: 500 }
    );
  }
}

// DELETE - Delete config
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();

    const deletedConfig = await ConfigModel.findOneAndDelete({
      _id: params.id,
      user_id: user._id,
    });

    if (!deletedConfig) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Config deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete config" },
      { status: 500 }
    );
  }
}
