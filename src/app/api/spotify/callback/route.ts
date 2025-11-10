import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verify } from "jsonwebtoken";
import querystring from "querystring";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      { error: "Authorization failed" },
      { status: 401 }
    );
  }
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Exchange authorization code for tokens
  const body = querystring.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "Failed to get tokens" },
      { status: 500 }
    );
  }

  const tokenData = await tokenRes.json();

  // Get logged-in user from JWT in cookies (you need to pass the user JWT here or use session)
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

  // Update MongoDB user document with Spotify tokens and link
  const client = await clientPromise;
  const db = client.db();

  // Optional: Fetch Spotify profile to get user id or link
  const profileRes = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const profile = await profileRes.json();

  await db.collection("users").updateOne(
    { _id: new (await import("mongodb")).ObjectId(decoded.userId) },
    {
      $set: {
        spotifyLink: profile.external_urls.spotify, // or profile.id
        spotifyAccessToken: tokenData.access_token,
        spotifyRefreshToken: tokenData.refresh_token,
        spotifyTokenExpiresIn: tokenData.expires_in,
      },
    }
  );

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
