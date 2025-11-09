import AnimatedBadge from "@/components/ui/animated-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ValueWithLabelProps {
  value: string;
  label: string;
}

const ValueWithLabel: React.FC<ValueWithLabelProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-3">
      <p className="font-xl font-bold">{value}</p>
      <Label className="text-center">{label}</Label>
    </div>
  );
};

export const ListeningProfile: React.FC = () => {
  return (
    <Card className="w-full ">
      <CardHeader className="gap-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm text-muted-foreground">
              Listening Profile (Nov)
            </CardTitle>
            <p className="font-bold text-xl">76 hours listened</p>
          </div>
          <Avatar className="size-18">
            <AvatarImage src="https://i.pinimg.com/736x/49/1e/27/491e2753bd2d8df79be60d6a61b0e61a.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-y-3">
        <div className="flex justify-center">
          <div className="flex justify-center gap-x-20 max-w-full md:max-w-md w-full px-4">
            <ValueWithLabel value="92" label="tracks" />
            <ValueWithLabel value="68%" label="mood diversity" />
            <ValueWithLabel value="5" label="top moods" />
          </div>
        </div>
        <div className="flex gap-x-2 mt-5">
          <AnimatedBadge text="Energetic" color="#FF6F61" />
          <AnimatedBadge text="Calm" color="#4A90E2" />
          <AnimatedBadge text="Melancholy" color="#6E7B8B" />
        </div>
      </CardContent>
    </Card>
  );
};
