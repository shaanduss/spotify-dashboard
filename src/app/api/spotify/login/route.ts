// app/api/spotify/login/route.ts (or pages/api/spotify/login.ts)
import { NextResponse } from "next/server";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
].join(" ");

export async function GET() {
  const state = Math.random().toString(36).substring(2, 15); // For CSRF protection, save in cookie or session ideally

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
    show_dialog: "true",
  });

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  return NextResponse.redirect(spotifyAuthUrl);
}
