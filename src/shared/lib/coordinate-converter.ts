import type { GpsCoordinate, GridCoordinate } from '../api/weather/types';

// 기상청 격자 변환 상수
const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기준점 Y좌표(GRID)

/**
 * GPS 좌표(WGS84)를 기상청 격자 좌표로 변환
 * @param coordinate GPS 좌표 {latitude, longitude}
 * @returns 격자 좌표 {nx, ny}
 */
export const convertGpsToGrid = (
  coordinate: GpsCoordinate
): GridCoordinate => {
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const { latitude, longitude } = coordinate;
  let ra = Math.tan(Math.PI * 0.25 + latitude * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);

  let theta = longitude * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
};

/**
 * 기상청 격자 좌표를 GPS 좌표(WGS84)로 변환
 * @param coordinate 격자 좌표 {nx, ny}
 * @returns GPS 좌표 {latitude, longitude}
 */
export const convertGridToGps = (
  coordinate: GridCoordinate
): GpsCoordinate => {
  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const { nx, ny } = coordinate;
  const xn = nx - XO;
  const yn = ro - ny + YO;
  const ra = Math.sqrt(xn * xn + yn * yn);

  let alat: number;
  if (sn < 0.0) {
    alat = -ra;
  } else {
    alat = ra;
  }

  alat = Math.pow((re * sf) / alat, 1.0 / sn);
  alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

  let theta: number;
  if (Math.abs(xn) <= 0.0) {
    theta = 0.0;
  } else {
    if (Math.abs(yn) <= 0.0) {
      theta = Math.PI * 0.5;
      if (xn < 0.0) {
        theta = -theta;
      }
    } else {
      theta = Math.atan2(xn, yn);
    }
  }

  const alon = theta / sn + olon;
  const latitude = alat * RADDEG;
  const longitude = alon * RADDEG;

  return { latitude, longitude };
};
