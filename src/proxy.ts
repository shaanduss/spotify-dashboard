import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;
  const publicPaths = [
    "/login",
    "/signup",
    "/api/auth/login",
    "/api/auth/signup",
  ];

  if (path.startsWith("/_next") || path === "/favicon.ico") {
    return NextResponse.next();
  }

  if (!token) {
    // Redirect to login for protected page
    if (!publicPaths.includes(path)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, JWT_SECRET);

    // If user is on public auth page but already logged in, redirect to home/dashboard
    if (publicPaths.includes(path)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authToken");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
