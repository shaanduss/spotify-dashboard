import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("authToken="));

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = tokenCookie.split("=")[1];

    const secret = process.env.JWT_SECRET!;
    const decoded = verify(token, secret) as { userId: string };

    if (!decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 401 }
    );
  }
}
