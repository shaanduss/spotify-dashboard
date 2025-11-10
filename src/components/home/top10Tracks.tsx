import { ItemImage } from "@/components/home/trackItems";
import AnimatedBadge from "@/components/ui/animated-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export const Top10Tracks: React.FC = () => {
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
};
