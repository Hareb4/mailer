// import { NextResponse, NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(request: NextRequest) {
//   // Normalize the path (remove trailing slash if present)
//   const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
//   console.log("Normalized path:", path);

//   const isPublicPath =
//     path === "/sign-in" || path === "/sign-up" || path === "/";
//   const token = request.cookies.get("token")?.value || "";

//   console.log("In the middleware", { isPublicPath, token, path });

//   // Allow public paths without requiring authentication
//   if (isPublicPath) {
//     console.log("Public path accessed, continuing");
//     return NextResponse.next();
//   }

//   // Check for token on protected routes
//   if (!token) {
//     console.log(
//       "Unauthenticated user on protected path, redirecting to /sign-in"
//     );
//     return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
//   }

//   try {
//     // Validate the token
//     jwt.verify(token, process.env.JWT_SECRET!);
//     console.log("Valid token, continuing");
//     return NextResponse.next();
//   } catch (err) {
//     console.error("Invalid token, redirecting to /sign-in, error: ", err);
//     const response = NextResponse.redirect(
//       new URL("/sign-in", request.nextUrl)
//     );
//     response.cookies.delete("token"); // Clear the invalid token
//     return response;
//   }
// }

// export const config = {
//   matcher: ["/", "/sign-in", "/sign-up", "/config"], // Add other paths if needed
// };

import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const isPublicPath =
    path === "/sign-in" || path === "/sign-up" || path === "/";
  const token = request.cookies.get("token")?.value || "";
  console.log("In the middleware", { isPublicPath, token, path });

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
    console.log("Valid token, continuing");
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
  matcher: ["/", "/sign-in", "/sign-up", "/config"],
};
