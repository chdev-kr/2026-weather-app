import axios from 'axios';
import type {
  ShortTermForecastResponse,
  MidTermLandForecastResponse,
  MidTermTemperatureForecastResponse,
  GridCoordinate,
} from './types';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const SHORTTERM_BASE_URL = import.meta.env.VITE_SHORTTERM_API_BASE_URL;
const MIDTERM_BASE_URL = import.meta.env.VITE_MIDTERM_API_BASE_URL;

// 단기예보 조회 (초단기실황, 초단기예보, 단기예보)
export const getShortTermForecast = async (
  coordinate: GridCoordinate,
  baseDate: string,
  baseTime: string
): Promise<ShortTermForecastResponse> => {
  const response = await axios.get<ShortTermForecastResponse>(
    `${SHORTTERM_BASE_URL}/getVilageFcst`,
    {
      params: {
        serviceKey: API_KEY,
        pageNo: 1,
        numOfRows: 1000,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: coordinate.nx,
        ny: coordinate.ny,
      },
    }
  );

  return response.data;
};

// 초단기실황 조회
export const getUltraShortTermStatus = async (
  coordinate: GridCoordinate,
  baseDate: string,
  baseTime: string
): Promise<ShortTermForecastResponse> => {
  const response = await axios.get<ShortTermForecastResponse>(
    `${SHORTTERM_BASE_URL}/getUltraSrtNcst`,
    {
      params: {
        serviceKey: API_KEY,
        pageNo: 1,
        numOfRows: 1000,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: coordinate.nx,
        ny: coordinate.ny,
      },
    }
  );

  return response.data;
};

// 초단기예보 조회
export const getUltraShortTermForecast = async (
  coordinate: GridCoordinate,
  baseDate: string,
  baseTime: string
): Promise<ShortTermForecastResponse> => {
  const response = await axios.get<ShortTermForecastResponse>(
    `${SHORTTERM_BASE_URL}/getUltraSrtFcst`,
    {
      params: {
        serviceKey: API_KEY,
        pageNo: 1,
        numOfRows: 1000,
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: coordinate.nx,
        ny: coordinate.ny,
      },
    }
  );

  return response.data;
};

// 중기 육상예보 조회
export const getMidTermLandForecast = async (
  regId: string,
  tmFc: string
): Promise<MidTermLandForecastResponse> => {
  const response = await axios.get<MidTermLandForecastResponse>(
    `${MIDTERM_BASE_URL}/getMidLandFcst`,
    {
      params: {
        serviceKey: API_KEY,
        pageNo: 1,
        numOfRows: 10,
        dataType: 'JSON',
        regId,
        tmFc,
      },
    }
  );

  return response.data;
};

// 중기 기온예보 조회
export const getMidTermTemperatureForecast = async (
  regId: string,
  tmFc: string
): Promise<MidTermTemperatureForecastResponse> => {
  const response = await axios.get<MidTermTemperatureForecastResponse>(
    `${MIDTERM_BASE_URL}/getMidTa`,
    {
      params: {
        serviceKey: API_KEY,
        pageNo: 1,
        numOfRows: 10,
        dataType: 'JSON',
        regId,
        tmFc,
      },
    }
  );

  return response.data;
};
