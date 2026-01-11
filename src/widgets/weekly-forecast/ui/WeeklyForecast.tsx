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
}

export const WeeklyForecast = ({ weeklyData }: WeeklyForecastProps) => {
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
    if (!wfAm && !wfPm) return '정보 없음';
    if (!wfPm) return wfAm || '정보 없음';
    if (!wfAm) return wfPm || '정보 없음';

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

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3">
        주간 예보 <span className="text-sm text-muted-foreground font-normal">(3일 이후)</span>
      </h2>
      <Card className="bg-muted/50">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {weeklyData.map((day, index) => {
              const weather = getRepresentativeWeather(day.wfAm, day.wfPm);
              const rainProb = getMaxRainProbability(day.rnStAm, day.rnStPm);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                >
                  {/* 날짜 */}
                  <div className="w-16 sm:w-20">
                    <p className="text-sm sm:text-base font-medium">{day.date}</p>
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
                      {day.taMin}°
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm sm:text-base text-red-600 font-medium">
                      {day.taMax}°
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
