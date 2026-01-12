import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

interface HourlyData {
  time: string;
  TMP: string;
  SKY: string;
  PTY: string;
  POP: string;
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
  isLoading?: boolean;
}

export const HourlyForecast = ({ hourlyData, isLoading = false }: HourlyForecastProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const getWeatherIcon = (sky: string, pty: string) => {
    if (pty !== "0") {
      if (pty === "1") return <CloudRain className="w-8 h-8 text-blue-500" />;
      if (pty === "3") return <CloudSnow className="w-8 h-8 text-blue-300" />;
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    }
    if (sky === "1") return <Sun className="w-8 h-8 text-yellow-500" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  const totalPages = Math.ceil(hourlyData.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = hourlyData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 px-1">
          시간별 예보
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 shrink-0" />

          <div className="flex gap-2 flex-1 max-w-full">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card
                key={index}
                className="bg-muted/50 flex-1 min-w-16 animate-pulse"
              >
                <CardContent className="p-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="h-3 w-10 bg-muted rounded" />
                    <div className="w-8 h-8 bg-muted rounded-full" />
                    <div className="h-5 w-8 bg-muted rounded" />
                    <div className="h-3 w-10 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="w-10 shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3 px-1">
        시간별 예보
      </h2>
      <div className="flex items-center justify-center gap-2">
        {/* 왼쪽 버튼 */}
        {currentPage > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 bg-background/80 hover:bg-background/90 border-2 rounded-full cursor-pointer"
            onClick={handlePrevPage}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-10 shrink-0" />
        )}

        {/* 카드 영역 */}
        <div className="flex gap-2 flex-1 max-w-full">
          {currentData.map((hour, index) => (
            <Card
              key={startIndex + index}
              className="bg-muted/50 flex-1 min-w-16"
            >
              <CardContent className="p-2">
                <div className="flex flex-col items-center gap-1.5">
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
          ))}
        </div>

        {/* 오른쪽 버튼 */}
        {currentPage < totalPages - 1 ? (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 bg-background/80 hover:bg-background/90 border-2 rounded-full cursor-pointer"
            onClick={handleNextPage}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-10 shrink-0" />
        )}
      </div>
    </div>
  );
};
