import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import { CurrentWeatherHero } from "@/widgets/current-weather/ui/CurrentWeatherHero";
import { HourlyForecast } from "@/widgets/hourly-forecast/ui/HourlyForecast";
import { WeeklyForecast } from "@/widgets/weekly-forecast/ui/WeeklyForecast";
import { WeatherDetails } from "@/widgets/weather-details/ui/WeatherDetails";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import { useLocationStore } from "@/shared/store/useLocationStore";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { convertGpsToGrid } from "@/shared/lib/coordinate-converter";
import {
  useShortTermForecast,
  useMidTermLandForecast,
  useMidTermTemperatureForecast,
} from "@/shared/api/weather/hooks";
import {
  getCurrentWeatherData,
  getMinMaxTemp,
  getHourlyForecast,
  getWeatherApiDateTime,
  getDailyForecastFromShortTerm,
} from "@/shared/lib/weather-parser";
import {
  getMidTermWeeklyForecast,
  getMidTermForecastTime,
  getLandForecastRegionCode,
  getTemperatureForecastRegionCode,
} from "@/shared/lib/midterm-parser";

export const WeatherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();
  const { currentLocation, clearCurrentLocation } = useLocationStore();
  const { refetch } = useGeolocation(false);

  // id에 따라 위치 정보 결정
  const locationInfo = useMemo(() => {
    if (id === "current") {
      if (!currentLocation) return null;
      return {
        address: currentLocation.address,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
    } else {
      // UUID로 즐겨찾기 찾기
      const favorite = favorites.find((fav) => fav.id === id);
      if (!favorite) return null;
      return {
        address: favorite.name,
        latitude: favorite.latitude,
        longitude: favorite.longitude,
      };
    }
  }, [id, currentLocation, favorites]);

  // 위치 정보가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!locationInfo) {
      navigate("/");
    }
  }, [locationInfo, navigate]);

  // GPS 좌표 → 기상청 격자 좌표 변환
  const gridCoordinate = useMemo(() => {
    if (!locationInfo) return null;
    return convertGpsToGrid({
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude,
    });
  }, [locationInfo]);

  // 기상청 API 호출
  const { baseDate, baseTime } = getWeatherApiDateTime();
  const { data: weatherData, isLoading: weatherLoading } = useShortTermForecast(
    gridCoordinate || { nx: 0, ny: 0 },
    baseDate,
    baseTime,
    !!gridCoordinate
  );

  // 중기예보 API 호출
  const landRegId = useMemo(() => {
    if (!locationInfo) return "";
    return getLandForecastRegionCode(locationInfo.latitude, locationInfo.longitude);
  }, [locationInfo]);

  const tempRegId = useMemo(() => {
    if (!locationInfo) return "";
    return getTemperatureForecastRegionCode(locationInfo.latitude, locationInfo.longitude);
  }, [locationInfo]);

  const tmFc = getMidTermForecastTime();

  const { data: midTermLandData } = useMidTermLandForecast(landRegId, tmFc, !!landRegId);
  const { data: midTermTempData } = useMidTermTemperatureForecast(tempRegId, tmFc, !!tempRegId);

  // 날씨 데이터 파싱
  const currentWeather = useMemo(() => {
    if (!weatherData?.response?.body?.items?.item) return null;
    const items = weatherData.response.body.items.item;
    return getCurrentWeatherData(items);
  }, [weatherData]);

  const minMaxTemp = useMemo(() => {
    if (!weatherData?.response?.body?.items?.item) return { min: "", max: "" };
    const items = weatherData.response.body.items.item;
    return getMinMaxTemp(items, baseDate);
  }, [weatherData, baseDate]);

  const hourlyData = useMemo(() => {
    if (!weatherData?.response?.body?.items?.item) return [];
    const items = weatherData.response.body.items.item;
    return getHourlyForecast(items, baseDate, 24);
  }, [weatherData, baseDate]);

  // 단기예보에서 일별 데이터 추출
  const shortTermDailyData = useMemo(() => {
    if (!weatherData?.response?.body?.items?.item) return [];
    const items = weatherData.response.body.items.item;
    return getDailyForecastFromShortTerm(items);
  }, [weatherData]);

  // 중기예보 데이터 파싱
  const midTermWeeklyData = useMemo(() => {
    const landItem = midTermLandData?.response?.body?.items?.item?.[0];
    const tempItem = midTermTempData?.response?.body?.items?.item?.[0];

    return getMidTermWeeklyForecast(landItem || null, tempItem || null, baseDate);
  }, [midTermLandData, midTermTempData, baseDate]);

  // 단기예보 + 중기예보 통합
  const weeklyData = useMemo(() => {
    return [...shortTermDailyData, ...midTermWeeklyData];
  }, [shortTermDailyData, midTermWeeklyData]);

  // 마지막 업데이트 시간
  const lastUpdateTime = useMemo(() => {
    if (!baseDate || !baseTime) return "";
    const year = baseDate.slice(0, 4);
    const month = baseDate.slice(4, 6);
    const day = baseDate.slice(6, 8);
    const hour = baseTime.slice(0, 2);
    const minute = baseTime.slice(2, 4);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }, [baseDate, baseTime]);

  // 로딩 상태
  const isLoading = weatherLoading || !currentWeather || !locationInfo;

  // 현재 위치 새로고침 핸들러 (현재 위치일 때만)
  const handleRefreshLocation = id === "current" ? () => {
    clearCurrentLocation();
    refetch();
  } : undefined;

  if (!locationInfo) {
    return null;
  }

  return (
    <>
      <Header showBackButton />

      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 현재 날씨 히어로 */}
          <CurrentWeatherHero
            location={locationInfo.address}
            temperature={currentWeather?.tmp || ""}
            tempMin={minMaxTemp.min}
            tempMax={minMaxTemp.max}
            sky={currentWeather?.sky || "1"}
            pty={currentWeather?.pty || "0"}
            pop={currentWeather?.pop || "0"}
            latitude={locationInfo.latitude}
            longitude={locationInfo.longitude}
            onRefreshLocation={handleRefreshLocation}
            isLoading={isLoading}
          />

          {/* 시간별 예보 */}
          {(isLoading || hourlyData.length > 0) && (
            <HourlyForecast
              hourlyData={hourlyData}
              isLoading={isLoading}
            />
          )}

          {/* 주간 예보 */}
          {(isLoading || weeklyData.length > 0) && (
            <WeeklyForecast
              weeklyData={weeklyData}
              isLoading={isLoading}
            />
          )}

          {/* 상세 정보 */}
          {(isLoading || currentWeather) && (
            <WeatherDetails
              humidity={currentWeather?.reh || "0"}
              windSpeed={currentWeather?.wsd || "0"}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      <Footer lastUpdate={lastUpdateTime} />
    </>
  );
};
