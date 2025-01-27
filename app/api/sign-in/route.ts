import Connection from "@/lib/mongodb";
import { User } from "@/types/user";
import { hash, compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/types/user";

Connection();

export const POST = async (NextRequest: NextResponse) => {
  try {
    const body = await NextRequest.json();
    console.log(body);
    const { email, password } = body;

    if (!email || !password) {
      return new Response("Username and Password is required", { status: 401 });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response("Email does not exist", { status: 400 });
    }
    console.log("user: ", user);

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return new Response("Incorrect Password", { status: 400 });
    }

    const tokenData: User = {
      email: user.email,
      profile_image_url: user.profile_image_url,
      name: user.name,
      _id: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({ message: "Login successfull" });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    console.log("Error");
    return new Response("Something went wrong ", { status: 500 });
  }
};
