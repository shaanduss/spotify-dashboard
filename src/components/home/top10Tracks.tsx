"use client";

import { ItemImage } from "@/components/home/trackItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { callSpotifyFastapi } from "@/lib/spotifyFastapi";
import { userType } from "@/schemas/userSchema";
import { useEffect, useState } from "react";

type Top10TracksProps = {
  user: userType;
};

export function Top10Tracks({ user }: Top10TracksProps) {
  const [accessToken, setAccessToken] = useState<string>(
    user.spotifyAccessToken
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTopTracks() {
      try {
        // Confirm user data is present in this subcomponent for now
        console.log("Top10Tracks user:", user);

        const { data, accessToken: newToken } = await callSpotifyFastapi<
          unknown,
          undefined
        >({
          url: "/spotify/top-tracks",
          accessToken,
          signal: controller.signal,
        });

        if (newToken !== accessToken) {
          setAccessToken(newToken);
          console.log("Top10Tracks refreshed access token");
        }

        console.log("Top10Tracks top-tracks result:", data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Top10Tracks fetch error:", err);
      }
    }

    if (user?._id && accessToken) fetchTopTracks();

    return () => controller.abort();
  }, [user, accessToken]);

  return (
    <Card className="w-full h-full flex flex-col p-6">
      <CardHeader className="gap-0 mt-2 flex justify-between items-center">
        <CardTitle className="text-xl">Top 10 Tracks (Nov)</CardTitle>
      </CardHeader>
      <ScrollArea className="h-42 w-full overflow-y-auto mt-4">
        <CardContent className="flex flex-col gap-y-3 justify-center items-center h-full">
          <ItemImage />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
