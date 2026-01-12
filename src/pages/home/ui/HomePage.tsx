import { useEffect, useMemo } from "react";
import { CurrentWeatherHero } from "@/widgets/current-weather/ui/CurrentWeatherHero";
import { HourlyForecast } from "@/widgets/hourly-forecast/ui/HourlyForecast";
import { WeeklyForecast } from "@/widgets/weekly-forecast/ui/WeeklyForecast";
import { SearchBar } from "@/widgets/search-bar/ui/SearchBar";
import { FavoritesList } from "@/widgets/favorites-list/ui/FavoritesList";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useWeatherData } from "@/shared/hooks/useWeatherData";
import { useShortTermForecast } from "@/shared/api/weather/hooks";
import { useLocationStore } from "@/shared/store/useLocationStore";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import { convertGpsToGrid } from "@/shared/lib/coordinate-converter";
import { coord2RegionCode } from "@/shared/lib/nominatim-geocoder";
import { parseAddressToShortForm } from "@/shared/lib/address-parser";
import { getCurrentWeatherData, getMinMaxTemp } from "@/shared/lib/weather-parser";

export const HomePage = () => {
  const { currentLocation, setCurrentLocation, clearCurrentLocation } =
    useLocationStore();
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

  // 4. 현재 위치 날씨 데이터 가져오기 (커스텀 Hook 사용)
  const {
    currentWeather,
    minMaxTemp,
    hourlyData,
    weeklyData,
    lastUpdateTime,
    isLoading: weatherLoading,
    baseDate,
    baseTime,
  } = useWeatherData({
    latitude: currentLocation?.latitude || null,
    longitude: currentLocation?.longitude || null,
    enabled: !!currentLocation,
  });

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
        const parsed = parseAddressToShortForm(fav.address);
        const parts = parsed.split(" ");
        province = parts[0] || "";
        district = parts[1] || "";
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

  // 메타 태그 업데이트 (메인)
  useEffect(() => {
    // 기본 제목
    const title = "웨더온 - 오늘의 날씨는?";
    document.title = title;

    // 메타 description
    const description =
      "현재 위치의 날씨를 확인하고 즐겨찾는 지역의 날씨를 한눈에 볼 수 있습니다.";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // Open Graph 태그들
    const currentUrl = window.location.href;

    const ogTags = [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: currentUrl },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${window.location.origin}/img/OG.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // Twitter Card 태그들
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${window.location.origin}/img/OG.jpg` },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, []);

  return (
    <>
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-6 px-3 sm:py-8 sm:px-4 lg:py-10 lg:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
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
            <HourlyForecast hourlyData={hourlyData} isLoading={isLoading} />
          )}

          {/* 주간 예보 */}
          {(isLoading || weeklyData.length > 0) && (
            <WeeklyForecast weeklyData={weeklyData} isLoading={isLoading} />
          )}
        </div>
      </main>

      <Footer lastUpdate={lastUpdateTime} />
    </>
  );
};
