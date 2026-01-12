import { useEffect, useMemo } from "react";
import { CurrentWeatherHero } from "@/widgets/current-weather/ui/CurrentWeatherHero";
import { HourlyForecast } from "@/widgets/hourly-forecast/ui/HourlyForecast";
import { WeeklyForecast } from "@/widgets/weekly-forecast/ui/WeeklyForecast";
import { SearchBar } from "@/widgets/search-bar/ui/SearchBar";
import { FavoritesList } from "@/widgets/favorites-list/ui/FavoritesList";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import {
  useShortTermForecast,
  useMidTermLandForecast,
  useMidTermTemperatureForecast,
} from "@/shared/api/weather/hooks";
import { useLocationStore } from "@/shared/store/useLocationStore";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import { convertGpsToGrid } from "@/shared/lib/coordinate-converter";
import { coord2RegionCode } from "@/shared/lib/nominatim-geocoder";
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

export const HomePage = () => {
  const { currentLocation, setCurrentLocation, clearCurrentLocation } = useLocationStore();
  const { favorites } = useFavoritesStore();

  // 1. 현재 위치 가져오기 (GPS)
  const {
    latitude,
    longitude,
    error: geoError,
    loading: geoLoading,
    refetch,
  } = useGeolocation(!currentLocation);

  // 2. GPS 좌표 → 주소 변환 (역지오코딩)
  useEffect(() => {
    // 위치 정보가 없거나, 주소가 "위도"로 시작하는 경우 (좌표 형식) 다시 변환
    const needsGeocoding =
      (latitude && longitude && !currentLocation) ||
      (latitude && longitude && currentLocation?.address.startsWith("위도"));

    if (needsGeocoding) {
      coord2RegionCode(longitude, latitude).then((address) => {
        if (address) {
          setCurrentLocation({
            address,
            latitude,
            longitude,
          });
        }
      });
    }
  }, [latitude, longitude, currentLocation, setCurrentLocation]);

  // 4. GPS 좌표 → 기상청 격자 좌표 변환
  const gridCoordinate = useMemo(() => {
    if (!currentLocation) return null;
    return convertGpsToGrid({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });
  }, [currentLocation]);

  // 5. 기상청 단기예보 API 호출
  const { baseDate, baseTime } = getWeatherApiDateTime();
  const { data: weatherData, isLoading: weatherLoading } = useShortTermForecast(
    gridCoordinate || { nx: 0, ny: 0 },
    baseDate,
    baseTime,
    !!gridCoordinate
  );

  // 6. 중기예보 API 호출
  // 육상예보와 기온예보는 서로 다른 지역코드 체계 사용
  const landRegId = useMemo(() => {
    if (!currentLocation) return "";
    return getLandForecastRegionCode(
      currentLocation.latitude,
      currentLocation.longitude
    );
  }, [currentLocation]);

  const tempRegId = useMemo(() => {
    if (!currentLocation) return "";
    return getTemperatureForecastRegionCode(
      currentLocation.latitude,
      currentLocation.longitude
    );
  }, [currentLocation]);

  const tmFc = getMidTermForecastTime();

  const { data: midTermLandData } = useMidTermLandForecast(
    landRegId,
    tmFc,
    !!landRegId
  );
  const { data: midTermTempData } = useMidTermTemperatureForecast(
    tempRegId,
    tmFc,
    !!tempRegId
  );

  // 7. 날씨 데이터 파싱
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

  // 8. 단기예보에서 일별 데이터 추출 (오늘부터 3일 후까지 4일)
  const shortTermDailyData = useMemo(() => {
    if (!weatherData?.response?.body?.items?.item) return [];
    const items = weatherData.response.body.items.item;
    return getDailyForecastFromShortTerm(items);
  }, [weatherData]);

  // 9. 중기예보 데이터 파싱 (4일 후부터 10일 후까지 7일)
  const midTermWeeklyData = useMemo(() => {
    const landItem = midTermLandData?.response?.body?.items?.item?.[0];
    const tempItem = midTermTempData?.response?.body?.items?.item?.[0];

    return getMidTermWeeklyForecast(
      landItem || null,
      tempItem || null,
      baseDate
    );
  }, [midTermLandData, midTermTempData, baseDate]);

  // 10. 단기예보 4일 + 중기예보 7일 = 총 11일 통합
  const weeklyData = useMemo(() => {
    return [...shortTermDailyData, ...midTermWeeklyData];
  }, [shortTermDailyData, midTermWeeklyData]);

  // 11. 마지막 업데이트 시간 (baseDate + baseTime 형식으로)
  const lastUpdateTime = useMemo(() => {
    if (!baseDate || !baseTime) return "";
    // YYYYMMDD + HHMM -> YYYY-MM-DD HH:MM 형식으로 변환
    const year = baseDate.slice(0, 4);
    const month = baseDate.slice(4, 6);
    const day = baseDate.slice(6, 8);
    const hour = baseTime.slice(0, 2);
    const minute = baseTime.slice(2, 4);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }, [baseDate, baseTime]);

  // 즐겨찾기 목록 - 최대 6개 고정 배열로 날씨 데이터 조회
  const fav0 = favorites[0];
  const fav1 = favorites[1];
  const fav2 = favorites[2];
  const fav3 = favorites[3];
  const fav4 = favorites[4];
  const fav5 = favorites[5];

  const grid0 = fav0
    ? convertGpsToGrid({ latitude: fav0.latitude, longitude: fav0.longitude })
    : { nx: 0, ny: 0 };
  const grid1 = fav1
    ? convertGpsToGrid({ latitude: fav1.latitude, longitude: fav1.longitude })
    : { nx: 0, ny: 0 };
  const grid2 = fav2
    ? convertGpsToGrid({ latitude: fav2.latitude, longitude: fav2.longitude })
    : { nx: 0, ny: 0 };
  const grid3 = fav3
    ? convertGpsToGrid({ latitude: fav3.latitude, longitude: fav3.longitude })
    : { nx: 0, ny: 0 };
  const grid4 = fav4
    ? convertGpsToGrid({ latitude: fav4.latitude, longitude: fav4.longitude })
    : { nx: 0, ny: 0 };
  const grid5 = fav5
    ? convertGpsToGrid({ latitude: fav5.latitude, longitude: fav5.longitude })
    : { nx: 0, ny: 0 };

  const { data: weather0 } = useShortTermForecast(
    grid0,
    baseDate,
    baseTime,
    !!fav0
  );
  const { data: weather1 } = useShortTermForecast(
    grid1,
    baseDate,
    baseTime,
    !!fav1
  );
  const { data: weather2 } = useShortTermForecast(
    grid2,
    baseDate,
    baseTime,
    !!fav2
  );
  const { data: weather3 } = useShortTermForecast(
    grid3,
    baseDate,
    baseTime,
    !!fav3
  );
  const { data: weather4 } = useShortTermForecast(
    grid4,
    baseDate,
    baseTime,
    !!fav4
  );
  const { data: weather5 } = useShortTermForecast(
    grid5,
    baseDate,
    baseTime,
    !!fav5
  );

  // 즐겨찾기 목록에 실제 날씨 데이터 매핑
  const favoritesWithWeather = useMemo(() => {
    const weatherDataArray = [
      weather0,
      weather1,
      weather2,
      weather3,
      weather4,
      weather5,
    ];

    return favorites.map((fav, index) => {
      // 사용자가 수정한 이름(name)이 원래 주소(address)와 다르면 사용자 지정 이름 사용
      // 같으면 주소를 파싱해서 표시
      let province = "";
      let district = "";

      if (fav.name !== fav.address) {
        // 사용자가 지정한 별칭 사용 (예: "우리집")
        province = fav.name;
        district = "";
      } else {
        // 주소를 파싱해서 "구 동" 형식으로 표시
        const parts = fav.address.split(" ");
        province = parts[1] || parts[0] || "";
        district = parts[2] || parts[1] || "";
      }

      // 해당 즐겨찾기의 날씨 데이터
      const weatherData = weatherDataArray[index];
      const items = weatherData?.response?.body?.items?.item;

      // 데이터가 로딩 중인지 확인
      const isLoading = !items;

      if (items) {
        const current = getCurrentWeatherData(items);
        const minMax = getMinMaxTemp(items, baseDate);

        if (current) {
          return {
            id: fav.id, // 실제 UUID 전달
            province,
            district,
            temperature: current.tmp,
            tempMin: minMax.min,
            tempMax: minMax.max,
            sky: current.sky,
            pty: current.pty,
            pop: current.pop,
            isLoading: false,
          };
        }
      }

      // 로딩 중이거나 데이터 없을 때 기본값
      return {
        id: fav.id, // 실제 UUID 전달
        province,
        district,
        temperature: "-",
        tempMin: "-",
        tempMax: "-",
        sky: "1",
        pty: "0",
        pop: "-",
        isLoading,
      };
    });
  }, [
    favorites,
    weather0,
    weather1,
    weather2,
    weather3,
    weather4,
    weather5,
    baseDate,
  ]);

  // 로딩 상태
  const isLoading = geoLoading || weatherLoading || !currentWeather;

  // 현재 위치 새로고침 핸들러
  const handleRefreshLocation = () => {
    clearCurrentLocation();
    refetch();
  };

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

          {/* 에러 메시지 */}
          {geoError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {geoError}
            </div>
          )}

          {/* 현재 날씨 히어로 섹션 */}
          {currentLocation && (
            <CurrentWeatherHero
              location={currentLocation.address}
              temperature={currentWeather?.tmp || ""}
              tempMin={minMaxTemp.min}
              tempMax={minMaxTemp.max}
              sky={currentWeather?.sky || "1"}
              pty={currentWeather?.pty || "0"}
              pop={currentWeather?.pop || "0"}
              clickable
              locationId="current"
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              onRefreshLocation={handleRefreshLocation}
              isLoading={isLoading}
            />
          )}

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
        </div>
      </main>

      {/* 푸터 */}
      <Footer lastUpdate={lastUpdateTime} />
    </>
  );
};
