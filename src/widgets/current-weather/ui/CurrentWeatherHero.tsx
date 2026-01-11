import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  MapPin,
  Droplets,
  Star,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CurrentWeatherHeroProps {
  location: string;
  temperature: string;
  tempMin: string;
  tempMax: string;
  sky: string;
  pty: string;
  pop: string;
  clickable?: boolean;
  locationId?: string;
}

export const CurrentWeatherHero = ({
  location,
  temperature,
  tempMin,
  tempMax,
  sky,
  pty,
  pop,
  clickable = false,
  locationId = "1",
}: CurrentWeatherHeroProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate(`/weather/${locationId}`);
    }
  };

  const getWeatherIcon = () => {
    if (pty !== "0") {
      if (pty === "1")
        return (
          <CloudRain className="w-12 h-12 sm:w-14 sm:h-14 text-blue-500" />
        );
      if (pty === "3")
        return (
          <CloudSnow className="w-12 h-12 sm:w-14 sm:h-14 text-blue-300" />
        );
      return <CloudRain className="w-12 h-12 sm:w-14 sm:h-14 text-blue-500" />;
    }
    if (sky === "1")
      return <Sun className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-500" />;
    return (
      <Cloud className="w-12 h-12 sm:w-14 sm:h-14 text-muted-foreground" />
    );
  };

  const getWeatherText = () => {
    if (pty !== "0") {
      if (pty === "1") return "비";
      if (pty === "2") return "비/눈";
      if (pty === "3") return "눈";
    }
    if (sky === "1") return "맑음";
    if (sky === "3") return "구름많음";
    return "흐림";
  };

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3">현재 위치 날씨</h2>
      <Card
        className={`relative bg-muted/50 ${clickable ? 'cursor-pointer hover:bg-muted/70 transition-colors' : ''}`}
        onClick={handleClick}
      >
        {/* 즐겨찾기 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Star className="w-5 h-5" />
        </Button>

        <CardContent className="pt-5 pb-5">
          {/* 위치 */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold">{location}</h2>
          </div>

          {/* 날씨 아이콘과 온도 */}
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="mb-2">{getWeatherIcon()}</div>
            <div className="text-4xl sm:text-5xl font-light mb-1">
              {temperature}°
            </div>
            <div className="text-base sm:text-lg text-muted-foreground">
              {getWeatherText()}
            </div>
          </div>

          {/* 최저/최고 온도 및 강수확률 */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <div className="flex items-center gap-0.5 text-blue-600">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>{tempMin}°</span>
              </div>
              <span className="text-muted-foreground">/</span>
              <div className="flex items-center gap-0.5 text-red-600">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{tempMax}°</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Droplets className="w-4 h-4" />
              <span>{pop}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
