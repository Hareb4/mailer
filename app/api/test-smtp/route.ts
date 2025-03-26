import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(request: Request) {
  console.log("hi from test-smtp route");
  const { searchParams } = new URL(request.url);
  const smtpServer = searchParams.get("smtpServer");
  const smtpPort = searchParams.get("smtpPort");
  const smtpEmail = searchParams.get("smtpEmail");
  const smtpPassword = searchParams.get("smtpPassword");

  // Validate input
  if (!smtpServer || !smtpPort || !smtpEmail || !smtpPassword) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  // Create a transporter using the provided SMTP credentials
  const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: Number(smtpPort),
    secure: false, // Use true for 465, false for other ports
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  // Test the SMTP connection
  try {
    await transporter.verify();
    return NextResponse.json({
      success: true,
      message: "SMTP connection test successful!",
    });
  } catch (error: any) {
    console.error("SMTP connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to connect to SMTP server.",
      },
      { status: 500 }
    );
  }
}
