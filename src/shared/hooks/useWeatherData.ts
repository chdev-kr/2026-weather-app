import { useMemo } from "react";
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

interface UseWeatherDataParams {
  latitude: number | null;
  longitude: number | null;
  enabled?: boolean; // API 호출 여부
}

/**
 * 위치 정보를 받아서 날씨 데이터를 가져오는 커스텀 Hook
 * HomePage와 WeatherDetail에서 공통으로 사용
 */
export const useWeatherData = ({
  latitude,
  longitude,
  enabled = true,
}: UseWeatherDataParams) => {
  // GPS 좌표 → 기상청 격자 좌표 변환
  const gridCoordinate = useMemo(() => {
    if (!latitude || !longitude) return null;
    return convertGpsToGrid({ latitude, longitude });
  }, [latitude, longitude]);

  // 기상청 단기예보 API 호출
  const { baseDate, baseTime } = getWeatherApiDateTime();
  const { data: weatherData, isLoading: weatherLoading } = useShortTermForecast(
    gridCoordinate || { nx: 0, ny: 0 },
    baseDate,
    baseTime,
    !!gridCoordinate && enabled
  );

  // 중기예보 API 호출
  const landRegId = useMemo(() => {
    if (!latitude || !longitude) return "";
    return getLandForecastRegionCode(latitude, longitude);
  }, [latitude, longitude]);

  const tempRegId = useMemo(() => {
    if (!latitude || !longitude) return "";
    return getTemperatureForecastRegionCode(latitude, longitude);
  }, [latitude, longitude]);

  const tmFc = getMidTermForecastTime();

  const { data: midTermLandData } = useMidTermLandForecast(
    landRegId,
    tmFc,
    !!landRegId && enabled
  );
  const { data: midTermTempData } = useMidTermTemperatureForecast(
    tempRegId,
    tmFc,
    !!tempRegId && enabled
  );

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

  const isLoading = weatherLoading || !currentWeather;

  return {
    currentWeather,
    minMaxTemp,
    hourlyData,
    weeklyData,
    lastUpdateTime,
    isLoading,
    baseDate,
    baseTime,
  };
};
