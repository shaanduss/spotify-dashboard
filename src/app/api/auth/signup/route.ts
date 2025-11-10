import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertedUser = await db.collection("users").insertOne({
    email,
    name,
    password: hashedPassword,
    spotifyLink: "",
    createdAt: new Date(),
  });

  return NextResponse.json({
    message: "User created",
    userId: insertedUser.insertedId,
  });
}
