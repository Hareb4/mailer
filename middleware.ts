import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const isPublicPath =
    path === "/sign-in" || path === "/sign-up" || path === "/";
  const token = request.cookies.get("token")?.value || "";
  console.log("from middleware");
  if (isPublicPath) {
    console.log("Public path accessed, continuing");
    return NextResponse.next();
  }

  if (!token) {
    console.log(
      "Unauthenticated user on protected path, redirecting to /sign-in"
    );
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error("Error: ", err, ". redirect to /sign-in");
    const response = NextResponse.redirect(
      new URL("/sign-in", request.nextUrl)
    );
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/config", "/newemail", "/lists"],
};
