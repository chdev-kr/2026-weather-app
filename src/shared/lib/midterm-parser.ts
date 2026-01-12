// 중기예보 데이터 파싱 유틸리티

import type {
  MidTermLandForecastItem,
  MidTermTemperatureForecastItem,
} from "@/shared/api/weather/types";

export interface WeeklyForecastData {
  date: string; // 날짜 (예: "1/12 월")
  wfAm: string; // 오전 날씨
  wfPm: string; // 오후 날씨
  taMin: string; // 최저기온
  taMax: string; // 최고기온
  rnStAm: string; // 오전 강수확률
  rnStPm: string; // 오후 강수확률
}

// 중기예보 API 데이터를 주간 예보 형식으로 변환

export const getMidTermWeeklyForecast = (
  landData: MidTermLandForecastItem | null,
  tempData: MidTermTemperatureForecastItem | null,
  baseDate: string
): WeeklyForecastData[] => {
  if (!landData || !tempData) {
    return [];
  }

  const result: WeeklyForecastData[] = [];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // 4일 후부터 10일 후까지(7일치)
  // 중기예보 API는 발표 시점에 따라 5일 후부터 데이터 제공
  // Day 4는 단기예보와 중기예보 사이 공백 기간이므로 "예보 준비중" 표시
  for (let i = 4; i <= 10; i++) {
    const targetDate = getDateAfterDays(baseDate, i);
    const dateObj = new Date(
      parseInt(targetDate.slice(0, 4)),
      parseInt(targetDate.slice(4, 6)) - 1,
      parseInt(targetDate.slice(6, 8))
    );

    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const dayOfWeek = days[dateObj.getDay()];

    // 기온 데이터
    const taMin = getTempMin(tempData, i);
    const taMax = getTempMax(tempData, i);

    // 날씨 및 강수확률
    const { wfAm, wfPm, rnStAm, rnStPm } = getWeatherInfo(landData, i);

    // Day 4는 데이터가 없을 수 있으므로 "예보 준비중" 표시
    const displayWfAm = wfAm === "정보없음" ? "예보 준비중" : wfAm;
    const displayWfPm = wfPm === "정보없음" ? "예보 준비중" : wfPm;

    result.push({
      date: `${month}/${date} ${dayOfWeek}`,
      wfAm: displayWfAm,
      wfPm: displayWfPm,
      taMin,
      taMax,
      rnStAm,
      rnStPm,
    });
  }

  return result;
};

// baseDate로부터 days일 후의 날짜 계산

const getDateAfterDays = (baseDate: string, days: number): string => {
  const year = parseInt(baseDate.slice(0, 4));
  const month = parseInt(baseDate.slice(4, 6)) - 1;
  const date = parseInt(baseDate.slice(6, 8));

  const targetDate = new Date(year, month, date);
  targetDate.setDate(targetDate.getDate() + days);

  const y = targetDate.getFullYear();
  const m = String(targetDate.getMonth() + 1).padStart(2, "0");
  const d = String(targetDate.getDate()).padStart(2, "0");

  return `${y}${m}${d}`;
};

//  중기기온예보에서 최저기온 추출

const getTempMin = (
  data: MidTermTemperatureForecastItem,
  day: number
): string => {
  const key = `taMin${day}` as keyof MidTermTemperatureForecastItem;
  return String(data[key] || 0);
};

// 중기기온예보에서 최고기온 추출

const getTempMax = (
  data: MidTermTemperatureForecastItem,
  day: number
): string => {
  const key = `taMax${day}` as keyof MidTermTemperatureForecastItem;
  return String(data[key] || 0);
};

// 중기육상예보에서 날씨 정보 추출
const getWeatherInfo = (
  data: MidTermLandForecastItem,
  day: number
): { wfAm: string; wfPm: string; rnStAm: string; rnStPm: string } => {
  let wfAm = "정보없음";
  let wfPm = "정보없음";
  let rnStAm = 0;
  let rnStPm = 0;

  // 4~7일: 오전/오후 구분
  if (day === 4) {
    wfAm = data.wf4Am || "정보없음";
    wfPm = data.wf4Pm || "정보없음";
    rnStAm = data.rnSt4Am || 0;
    rnStPm = data.rnSt4Pm || 0;
  } else if (day === 5) {
    wfAm = data.wf5Am || "정보없음";
    wfPm = data.wf5Pm || "정보없음";
    rnStAm = data.rnSt5Am || 0;
    rnStPm = data.rnSt5Pm || 0;
  } else if (day === 6) {
    wfAm = data.wf6Am || "정보없음";
    wfPm = data.wf6Pm || "정보없음";
    rnStAm = data.rnSt6Am || 0;
    rnStPm = data.rnSt6Pm || 0;
  } else if (day === 7) {
    wfAm = data.wf7Am || "정보없음";
    wfPm = data.wf7Pm || "정보없음";
    rnStAm = data.rnSt7Am || 0;
    rnStPm = data.rnSt7Pm || 0;
  }
  // 8~10일: 종일 예보 (오전/오후 동일하게)
  else if (day === 8) {
    wfAm = data.wf8 || "정보없음";
    wfPm = data.wf8 || "정보없음";
    rnStAm = data.rnSt8 || 0;
    rnStPm = data.rnSt8 || 0;
  } else if (day === 9) {
    wfAm = data.wf9 || "정보없음";
    wfPm = data.wf9 || "정보없음";
    rnStAm = data.rnSt9 || 0;
    rnStPm = data.rnSt9 || 0;
  } else if (day === 10) {
    wfAm = data.wf10 || "정보없음";
    wfPm = data.wf10 || "정보없음";
    rnStAm = data.rnSt10 || 0;
    rnStPm = data.rnSt10 || 0;
  }

  return {
    wfAm,
    wfPm,
    rnStAm: String(rnStAm),
    rnStPm: String(rnStPm),
  };
};

/**
 * 중기예보 API 발표 시각 계산
 * 항상 06시 발표 데이터를 사용하여 Day 3, Day 4 데이터를 포함
 * (18시 발표는 Day 3, Day 4 데이터가 없을 수 있음)
 */
export const getMidTermForecastTime = (): string => {
  const now = new Date();
  const hour = now.getHours();

  // 06시 이전이면 전날 06시 발표 시각 사용
  if (hour < 6) {
    now.setDate(now.getDate() - 1);
    now.setHours(6, 0, 0, 0);
  }
  // 06시 이후면 당일 06시 발표 시각 사용
  else {
    now.setHours(6, 0, 0, 0);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");

  return `${year}${month}${date}${hours}00`;
};

/**
 * GPS 좌표를 중기육상예보 지역 코드(regId)로 매핑
 * 육상예보용 광역코드 반환
 */
export const getLandForecastRegionCode = (
  latitude: number,
  longitude: number
): string => {
  // 충북 (대전보다 동쪽, 경도가 더 큼)
  if (
    latitude >= 36.0 &&
    latitude <= 37.5 &&
    longitude >= 127.5 &&
    longitude <= 128.5
  ) {
    return "11C10000";
  }
  // 대전/세종/충남
  if (
    latitude >= 36.0 &&
    latitude <= 37.0 &&
    longitude >= 126.5 &&
    longitude <= 127.5
  ) {
    return "11C20000";
  }
  // 서울/인천/경기도
  if (
    latitude >= 37.0 &&
    latitude <= 38.0 &&
    longitude >= 126.5 &&
    longitude <= 127.5
  ) {
    return "11B00000";
  }
  // 광주/전남
  if (
    latitude >= 34.5 &&
    latitude <= 36.0 &&
    longitude >= 126.0 &&
    longitude <= 127.5
  ) {
    return "11F20000";
  }
  // 전북
  if (
    latitude >= 35.5 &&
    latitude <= 36.5 &&
    longitude >= 126.5 &&
    longitude <= 127.5
  ) {
    return "11F10000";
  }
  // 부산/울산/경남
  if (
    latitude >= 34.5 &&
    latitude <= 36.0 &&
    longitude >= 128.0 &&
    longitude <= 129.5
  ) {
    return "11H20000";
  }
  // 대구/경북
  if (
    latitude >= 35.5 &&
    latitude <= 37.0 &&
    longitude >= 128.0 &&
    longitude <= 129.5
  ) {
    return "11H10000";
  }
  // 강원도
  if (
    latitude >= 37.0 &&
    latitude <= 39.0 &&
    longitude >= 127.5 &&
    longitude <= 129.5
  ) {
    return "11D10000";
  }
  // 제주도
  if (
    latitude >= 33.0 &&
    latitude <= 34.0 &&
    longitude >= 126.0 &&
    longitude <= 127.0
  ) {
    return "11G00000";
  }

  return "11B00000";
};

/**
 * GPS 좌표를 중기기온예보 지역 코드(regId)로 매핑
 * 기온예보용 세부코드 반환
 */
export const getTemperatureForecastRegionCode = (
  latitude: number,
  longitude: number
): string => {
  // 충북 (대전보다 동쪽, 경도가 더 큼)
  if (
    latitude >= 36.0 &&
    latitude <= 37.5 &&
    longitude >= 127.5 &&
    longitude <= 128.5
  ) {
    return "11C10301"; // 청주
  }
  // 대전/세종/충남
  if (
    latitude >= 36.0 &&
    latitude <= 37.0 &&
    longitude >= 126.5 &&
    longitude <= 127.5
  ) {
    return "11C20401"; // 대전
  }
  // 서울/인천/경기도
  if (
    latitude >= 37.0 &&
    latitude <= 38.0 &&
    longitude >= 126.5 &&
    longitude <= 127.5
  ) {
    return "11B10101"; // 서울
  }
  // 광주/전남
  if (
    latitude >= 34.5 &&
    latitude <= 36.0 &&
    longitude >= 126.0 &&
    longitude <= 127.5
  ) {
    return "11F20501"; // 광주
  }
  // 전북
  if (
    latitude >= 35.5 &&
    latitude <= 36.5 &&
    longitude >= 126.5 &&
    longitude <= 127.5
  ) {
    return "11F10201"; // 전주
  }
  // 부산/울산/경남
  if (
    latitude >= 34.5 &&
    latitude <= 36.0 &&
    longitude >= 128.0 &&
    longitude <= 129.5
  ) {
    return "11H20201"; // 부산
  }
  // 대구/경북
  if (
    latitude >= 35.5 &&
    latitude <= 37.0 &&
    longitude >= 128.0 &&
    longitude <= 129.5
  ) {
    return "11H10701"; // 대구
  }
  // 강원도
  if (
    latitude >= 37.0 &&
    latitude <= 39.0 &&
    longitude >= 127.5 &&
    longitude <= 129.5
  ) {
    return "11D10301"; // 춘천
  }
  // 제주도
  if (
    latitude >= 33.0 &&
    latitude <= 34.0 &&
    longitude >= 126.0 &&
    longitude <= 127.0
  ) {
    return "11G00201"; // 제주
  }

  return "11B10101";
};
