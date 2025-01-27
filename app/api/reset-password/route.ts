import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "@/types/user";

export async function POST(request: Request) {
  try {
    const { password, token } = await request.json();

    if (!token || !password) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        email: string;
      };

      // Find the user
      const user = await UserModel.findOne({ email: decoded.email });
      if (!user) {
        return NextResponse.json("User not found", { status: 404 });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      await UserModel.updateOne(
        { email: decoded.email },
        { password: hashedPassword }
      );

      return NextResponse.json("Password reset successfully", { status: 200 });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          "Token has expired. Please request a new password reset.",
          { status: 401 }
        );
      }
      return NextResponse.json("Invalid token", { status: 400 });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
