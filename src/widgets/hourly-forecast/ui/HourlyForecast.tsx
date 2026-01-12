import { Cloud, CloudRain, Sun, CloudSnow, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HourlyData {
  time: string;
  TMP: string;
  SKY: string;
  PTY: string;
  POP: string;
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
}

export const HourlyForecast = ({ hourlyData }: HourlyForecastProps) => {
  const getWeatherIcon = (sky: string, pty: string) => {
    if (pty !== "0") {
      if (pty === "1") return <CloudRain className="w-8 h-8 text-blue-500" />;
      if (pty === "3") return <CloudSnow className="w-8 h-8 text-blue-300" />;
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    }
    if (sky === "1") return <Sun className="w-8 h-8 text-yellow-500" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3 px-1">
        시간별 예보
      </h2>
      <div className="overflow-x-auto scrollbar-hide snap-x -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
        <div className="flex gap-3 min-w-max">
          {hourlyData.map((hour, index) => (
            <div key={index} className="snap-start">
              <Card className="bg-muted/50 min-w-20 shrink-0">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground font-medium">
                      {hour.time}
                    </div>
                    <div>{getWeatherIcon(hour.SKY, hour.PTY)}</div>
                    <div className="text-lg font-semibold">{hour.TMP}°</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="w-3 h-3" />
                      <span>{hour.POP}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
