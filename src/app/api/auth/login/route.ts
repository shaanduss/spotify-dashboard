import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { sign, Secret, SignOptions } from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "default_secret";
  // Use either a string like "1h" or a number (seconds). Cast explicitly for TS
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "1h") as SignOptions["expiresIn"];

  const options: SignOptions = { expiresIn };

  const token = sign(
    { userId: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    options
  );

  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // maxAge cookie expects seconds, so parse if string like "1h"
    maxAge:
      typeof expiresIn === "string"
        ? parseExpiresInToSeconds(expiresIn)
        : expiresIn ?? 3600,
    path: "/",
  });

  return response;
}

// Helper to parse string like "1h", "30m" to seconds
function parseExpiresInToSeconds(exp: string): number {
  const regex = /^(\d+)([smhd])$/; // Supports seconds, minutes, hours, days
  const match = exp.match(regex);
  if (!match) return 3600; // default 1 hour

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      return 3600;
  }
}
