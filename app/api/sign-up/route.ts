import Connection from "@/lib/mongodb";
import User from "@/types/user";
import { hash, compare, genSalt } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

Connection();

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response("Name, Username and Password is required", {
        status: 401,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return new Response("Email already exists", {
        status: 401,
      });
    }

    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response("User saved successfully", { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
