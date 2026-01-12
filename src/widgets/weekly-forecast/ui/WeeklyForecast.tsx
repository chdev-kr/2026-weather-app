import { Cloud, CloudRain, Sun, CloudSnow, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DailyData {
  date: string;
  wfAm: string;
  wfPm: string;
  taMin: string;
  taMax: string;
  rnStAm: string;
  rnStPm: string;
}

interface WeeklyForecastProps {
  weeklyData: DailyData[];
  isLoading?: boolean;
}

export const WeeklyForecast = ({ weeklyData, isLoading = false }: WeeklyForecastProps) => {
  // 날씨 텍스트를 기반으로 아이콘 반환
  const getWeatherIcon = (weather: string) => {
    if (weather.includes("비")) {
      return <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
    }
    if (weather.includes("눈")) {
      return <CloudSnow className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />;
    }
    if (weather.includes("맑음")) {
      return <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
    }
    return <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
  };

  // 오전/오후 중 더 대표적인 날씨 선택
  const getRepresentativeWeather = (wfAm: string, wfPm: string) => {
    // undefined 체크
    if (!wfAm && !wfPm) return "정보 없음";
    if (!wfPm) return wfAm || "정보 없음";
    if (!wfAm) return wfPm || "정보 없음";

    // 비나 눈이 있으면 우선
    if (wfPm.includes("비") || wfPm.includes("눈")) return wfPm;
    if (wfAm.includes("비") || wfAm.includes("눈")) return wfAm;
    // 오후 날씨를 기본으로
    return wfPm;
  };

  // 오전/오후 중 높은 강수확률 선택
  const getMaxRainProbability = (rnStAm: string, rnStPm: string) => {
    const am = parseInt(rnStAm) || 0;
    const pm = parseInt(rnStPm) || 0;
    return Math.max(am, pm).toString();
  };

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 px-1">
          주간 예보
        </h2>
        <Card className="bg-muted/50 py-0 animate-pulse">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4"
                >
                  {/* 날짜 */}
                  <div className="w-16 sm:w-20">
                    <div className="h-4 w-12 bg-muted rounded" />
                  </div>

                  {/* 날씨 아이콘 */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded-full" />
                    <div className="h-3 w-16 bg-muted rounded hidden sm:block" />
                  </div>

                  {/* 강수확률 */}
                  <div className="flex items-center gap-1 w-16 sm:w-20 justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded" />
                    <div className="h-3 w-8 bg-muted rounded" />
                  </div>

                  {/* 최저/최고 기온 */}
                  <div className="flex items-center gap-2 w-24 sm:w-32 justify-end">
                    <div className="h-4 w-8 bg-muted rounded" />
                    <div className="h-4 w-2 bg-muted rounded" />
                    <div className="h-4 w-8 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3 px-1">
        주간 예보
      </h2>
      <Card className="bg-muted/50 py-0">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {weeklyData.map((day, index) => {
              const weather = getRepresentativeWeather(day.wfAm, day.wfPm);
              const rainProb = getMaxRainProbability(day.rnStAm, day.rnStPm);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 transition-colors"
                >
                  {/* 날짜 */}
                  <div className="w-16 sm:w-20">
                    <p className="text-sm sm:text-base font-medium">
                      {day.date}
                    </p>
                  </div>

                  {/* 날씨 아이콘 */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {getWeatherIcon(weather)}
                    <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                      {weather}
                    </span>
                  </div>

                  {/* 강수확률 */}
                  <div className="flex items-center gap-1 w-16 sm:w-20 justify-center">
                    <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {rainProb}%
                    </span>
                  </div>

                  {/* 최저/최고 기온 */}
                  <div className="flex items-center gap-2 w-24 sm:w-32 justify-end">
                    <span className="text-sm sm:text-base text-blue-600 font-medium">
                      {Math.round(parseFloat(day.taMin) || 0)}°
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm sm:text-base text-red-600 font-medium">
                      {Math.round(parseFloat(day.taMax) || 0)}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
