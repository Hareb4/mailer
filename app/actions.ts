"use server";

import { encodedRedirect } from "@/utils/utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { hash, compare } from "bcrypt";
import { decrypt } from "@/utils/crypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { ApiError } from "next/dist/server/api-utils";
import UserModel from "@/types/user";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

function generateRandomProfileImage(name: string): string {
  // Using DiceBear API to generate random avatars
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`;
}

const origin = "http://localhost:8080/";

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Use false for STARTTLS
  auth: {
    user: process.env.EMAIL_AUTH!,
    pass: process.env.EMAIL_PASSWORD_AUTH!,
  },
  debug: true,
  logger: true,
});

export const forgotPasswordAction = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Email does not exist");
  }

  // Generate a token to be used for password reset
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "5m",
  });

  // Construct the email content with the token
  const mailOptions = {
    from: process.env.EMAIL_AUTH!,
    to: email.toLowerCase(),
    subject: "Reset Password",
    html: `
      <h1>Reset Your Password</h1>
      <p>To reset your password, please click the link below:</p>
      <a href="${origin}/reset-password?token=${token}">Reset Password</a>
      <p>This link will expire in 5 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { status: 200, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error while sending email:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export const getUserFromToken = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      profile_image_url?: string;
      name: string;
      _id: string;
    };

    // Return user object
    return {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      profile_image_url: decoded.profile_image_url,
    };
  } catch (err) {
    console.error("Token verification error:", err);
    throw new Error("Invalid token");
  }
};
