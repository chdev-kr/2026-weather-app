import { Droplets, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherDetailsProps {
  humidity: string;  // 습도 (%)
  windSpeed: string; // 풍속 (m/s)
}

export const WeatherDetails = ({ humidity, windSpeed }: WeatherDetailsProps) => {
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
