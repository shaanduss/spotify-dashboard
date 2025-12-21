import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";

type SpotifyRefreshResponse = {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in: number;
  refresh_token?: string;
};

export async function POST(request: Request) {
  try {
    // Identify user from auth cookie (same pattern as /api/auth/user and callback)
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

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { spotifyRefreshToken: 1 } }
      );

    const refreshToken = (user as { spotifyRefreshToken?: string } | null)
      ?.spotifyRefreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No Spotify refresh token on file" },
        { status: 400 }
      );
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString();

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Failed to refresh Spotify token", details: errorText },
        { status: 500 }
      );
    }

    const tokenData = (await tokenRes.json()) as SpotifyRefreshResponse;

    // Persist new access token (+ refresh token if Spotify returns a rotated one)
    const set: Record<string, unknown> = {
      spotifyAccessToken: tokenData.access_token,
      spotifyTokenExpiresIn: tokenData.expires_in,
    };
    if (tokenData.refresh_token) {
      set.spotifyRefreshToken = tokenData.refresh_token;
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      {
        $set: set,
      }
    );

    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
    });
  } catch (err) {
    console.error("Error refreshing Spotify token:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
