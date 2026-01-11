import { useParams } from "react-router-dom";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import { CurrentWeatherHero } from "@/widgets/current-weather/ui/CurrentWeatherHero";
import { HourlyForecast } from "@/widgets/hourly-forecast/ui/HourlyForecast";
import { WeeklyForecast } from "@/widgets/weekly-forecast/ui/WeeklyForecast";
import { WeatherDetails } from "@/widgets/weather-details/ui/WeatherDetails";
import {
  mockShortTermWeather,
  mockMidTermWeather,
} from "@/shared/mock/weatherData";

export const WeatherDetail = () => {
  const { id } = useParams();

  // TODO: id로 실제 데이터 가져오기 (현재는 mock 데이터 사용)

  return (
    <>
      <Header showBackButton />

      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 현재 날씨 히어로 */}
          <CurrentWeatherHero
            location={mockShortTermWeather.location}
            temperature={mockShortTermWeather.current.TMP}
            tempMin={mockShortTermWeather.daily[0].TMN}
            tempMax={mockShortTermWeather.daily[0].TMX}
            sky={mockShortTermWeather.current.SKY}
            pty={mockShortTermWeather.current.PTY}
            pop={mockShortTermWeather.current.POP}
          />

          {/* 시간별 예보 */}
          <HourlyForecast hourlyData={mockShortTermWeather.hourly} />

          {/* 주간 예보 */}
          <WeeklyForecast weeklyData={mockMidTermWeather.weekly} />

          {/* 상세 정보 */}
          <WeatherDetails
            humidity={mockShortTermWeather.current.REH}
            windSpeed={mockShortTermWeather.current.WSD}
          />
        </div>
      </main>

      <Footer />
    </>
  );
};
