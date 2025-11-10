import Image from "next/image";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import AnimatedBadge from "@/components/ui/animated-badge";
import { moodColors, moods } from "@/data/moodData";

interface MusicItem {
  title: string;
  artist: string;
  duration: string;
  topMood: (typeof moods)[number];
}

const music: MusicItem[] = [
  {
    title: "Midnight City Lights",
    artist: "Neon Dreams",
    duration: "3:45",
    topMood: "Happy",
  },
  {
    title: "Coffee Shop Conversations",
    artist: "The Morning Brew",
    duration: "4:05",
    topMood: "Calm",
  },
  {
    title: "Digital Rain",
    artist: "Cyber Symphony",
    duration: "3:30",
    topMood: "Melancholy",
  },
  {
    title: "Mohana",
    artist: "The Morning Brew",
    duration: "4:05",
    topMood: "Melancholy",
  },
  {
    title: "Gotham Nights",
    artist: "Cyber Symphony",
    duration: "3:30",
    topMood: "Energetic",
  },
];

export function ItemImage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup className="gap-4">
        {music.map((song, index) => (
          <Item key={song.title} variant="outline" asChild role="listitem">
            <a href="#">
              <ItemMedia variant="image">
                <Image
                  src={`https://avatar.vercel.sh/${song.title}`}
                  alt={song.title}
                  width={32}
                  height={32}
                  className="object-cover grayscale"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{`${index + 1}. ${
                  song.title
                }`}</ItemTitle>
                <ItemDescription>{song.artist}</ItemDescription>
              </ItemContent>
              <ItemContent className="flex-none text-center">
                <AnimatedBadge
                  text={song.topMood}
                  color={moodColors[moods.indexOf(song.topMood)]}
                />
              </ItemContent>
            </a>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
