import { Droplets, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherDetailsProps {
  humidity: string;  // 습도 (%)
  windSpeed: string; // 풍속 (m/s)
  isLoading?: boolean;
}

export const WeatherDetails = ({ humidity, windSpeed, isLoading = false }: WeatherDetailsProps) => {
  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3">상세 정보</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* 습도 카드 스켈레톤 */}
          <Card className="bg-muted/50 animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
                <div className="h-9 sm:h-10 w-20 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>

          {/* 풍속 카드 스켈레톤 */}
          <Card className="bg-muted/50 animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded" />
                  <div className="h-4 w-12 bg-muted rounded" />
                </div>
                <div className="h-9 sm:h-10 w-24 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3">상세 정보</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* 습도 카드 */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <h3 className="text-sm sm:text-base font-medium text-muted-foreground">
                  습도
                </h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{humidity}%</p>
            </div>
          </CardContent>
        </Card>

        {/* 풍속 카드 */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                <h3 className="text-sm sm:text-base font-medium text-muted-foreground">
                  풍속
                </h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{windSpeed} m/s</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
