import { mockShortTermWeather, mockFavorites, mockMidTermWeather } from "@/shared/mock/weatherData";
import { CurrentWeatherHero } from "@/widgets/current-weather/ui/CurrentWeatherHero";
import { HourlyForecast } from "@/widgets/hourly-forecast/ui/HourlyForecast";
import { WeeklyForecast } from "@/widgets/weekly-forecast/ui/WeeklyForecast";
import { SearchBar } from "@/widgets/search-bar/ui/SearchBar";
import { FavoritesList } from "@/widgets/favorites-list/ui/FavoritesList";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";

export const HomePage = () => {
  // Mock 즐겨찾기 데이터 (실제로는 상태 관리 필요)
  const favoritesWithWeather = mockFavorites.map((fav) => ({
    ...fav,
    temperature: "3",
    tempMin: "-5",
    tempMax: "5",
    sky: "1",
    pty: "0",
    pop: "20",
  }));

  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 검색바 */}
          <SearchBar />

          {/* 즐겨찾기 */}
          {favoritesWithWeather.length > 0 && (
            <FavoritesList favorites={favoritesWithWeather} />
          )}

          {/* 현재 날씨 히어로 섹션 */}
          <CurrentWeatherHero
            location={mockShortTermWeather.location}
            temperature={mockShortTermWeather.current.TMP}
            tempMin={mockShortTermWeather.daily[0].TMN}
            tempMax={mockShortTermWeather.daily[0].TMX}
            sky={mockShortTermWeather.current.SKY}
            pty={mockShortTermWeather.current.PTY}
            pop={mockShortTermWeather.current.POP}
            clickable
            locationId="1"
          />

          {/* 시간별 예보 */}
          <HourlyForecast hourlyData={mockShortTermWeather.hourly} />

          {/* 주간 예보 */}
          <WeeklyForecast weeklyData={mockMidTermWeather.weekly} />
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </>
  );
};
