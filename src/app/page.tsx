import { ListeningProfile } from "@/components/home/listeningProfile";
import { MoodPieChart } from "@/components/home/moodPieChart";
import { Top10Tracks } from "@/components/home/top10Tracks";

export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-screen w-full rounded-xl shadow-lg p-5 gap-y-10">
      <div className="flex gap-x-8 ">
        <ListeningProfile />
        <Top10Tracks />
      </div>
      <MoodPieChart />
    </div>
  );
}
