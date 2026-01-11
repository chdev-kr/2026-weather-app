import { useQuery } from "@tanstack/react-query";
import {
  getShortTermForecast,
  getUltraShortTermStatus,
  getUltraShortTermForecast,
  getMidTermLandForecast,
  getMidTermTemperatureForecast,
} from "./client";
import type { GridCoordinate } from "./types";

// 단기예보 조회 훅

export const useShortTermForecast = (
  coordinate: GridCoordinate,
  baseDate: string,
  baseTime: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["shortTermForecast", coordinate, baseDate, baseTime],
    queryFn: () => getShortTermForecast(coordinate, baseDate, baseTime),
    enabled,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });
};

/**
 * 초단기실황 조회 훅
 */
export const useUltraShortTermStatus = (
  coordinate: GridCoordinate,
  baseDate: string,
  baseTime: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["ultraShortTermStatus", coordinate, baseDate, baseTime],
    queryFn: () => getUltraShortTermStatus(coordinate, baseDate, baseTime),
    enabled,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
  });
};

// 초단기예보 조회 훅

export const useUltraShortTermForecast = (
  coordinate: GridCoordinate,
  baseDate: string,
  baseTime: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["ultraShortTermForecast", coordinate, baseDate, baseTime],
    queryFn: () => getUltraShortTermForecast(coordinate, baseDate, baseTime),
    enabled,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
  });
};

// 중기 육상예보 조회 훅

export const useMidTermLandForecast = (
  regId: string,
  tmFc: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["midTermLandForecast", regId, tmFc],
    queryFn: () => getMidTermLandForecast(regId, tmFc),
    enabled,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 2, // 2시간
  });
};

// 중기 기온예보 조회 훅

export const useMidTermTemperatureForecast = (
  regId: string,
  tmFc: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["midTermTemperatureForecast", regId, tmFc],
    queryFn: () => getMidTermTemperatureForecast(regId, tmFc),
    enabled,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 2, // 2시간
  });
};
