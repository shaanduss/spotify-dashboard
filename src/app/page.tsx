"use client";
import { ListeningProfile } from "@/components/home/listeningProfile";
import { MoodPieChart } from "@/components/home/moodPieChart";
import { Top10Tracks } from "@/components/home/top10Tracks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userType } from "@/schemas/userSchema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<userType>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setLoading(false);
        console.log(data);
      } else {
        router.push("/login");
      }
    }
    fetchUser();
  }, [router]);

  return (
    <div className="flex flex-col justify-center min-h-screen w-full rounded-xl shadow-lg p-5 gap-y-10">
      {loading && (
        <div className="w-full flex justify-center">
          <div>
            <Badge className="text-md gap-x-3">
              <Spinner className="!size-4" />
              Fetching...
            </Badge>
          </div>
        </div>
      )}
      {!loading && user?.spotifyLink == "" && (
        <div className="w-full h-full flex items-center justify-center">
          <Button
            variant="outline"
            className="w-64"
            onClick={() => router.push("/api/spotify/login")}
          >
            Connect Spotify Account
          </Button>
        </div>
      )}

      {!loading && user?.spotifyLink != "" && (
        <>
          <div className="flex gap-x-8 ">
            <ListeningProfile />
            <Top10Tracks />
          </div>
          <MoodPieChart />
        </>
      )}
    </div>
  );
}
