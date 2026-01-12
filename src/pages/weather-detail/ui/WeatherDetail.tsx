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

  // 메타 태그 업데이트
  useEffect(() => {
    if (!locationInfo || !currentWeather) return;

    const location = locationInfo.address;
    const temp = currentWeather.tmp;

    // 날씨 상태 텍스트
    let weatherText = "맑음";
    if (currentWeather.pty !== "0") {
      if (currentWeather.pty === "1") weatherText = "비";
      else if (currentWeather.pty === "2") weatherText = "비/눈";
      else if (currentWeather.pty === "3") weatherText = "눈";
    } else if (currentWeather.sky === "3") {
      weatherText = "구름많음";
    } else if (currentWeather.sky === "4") {
      weatherText = "흐림";
    }

    // 페이지 제목
    const title = `${location} 날씨 - 현재 ${temp}° (${weatherText})`;
    document.title = title;

    // 메타 description
    const description = `${location}의 날씨 정보를 확인하세요. 현재 기온 ${temp}°, 최저 ${minMaxTemp.min}° / 최고 ${minMaxTemp.max}°`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Open Graph 태그들
    const currentUrl = window.location.href;

    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${window.location.origin}/img/OG.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Twitter Card 태그들
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${window.location.origin}/img/OG.jpg` },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 컴포넌트 언마운트 시 기본 제목으로 복원
    return () => {
      document.title = '날씨 앱';
    };
  }, [locationInfo, currentWeather, minMaxTemp]);

  if (!locationInfo) {
    return null;
  }

  return (
    <>
      <Header showBackButton />

      <main className="flex-1 py-6 px-3 sm:py-8 sm:px-4 lg:py-10 lg:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
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
