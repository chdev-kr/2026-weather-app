/**
 * Nominatim 오픈소스 역지오코딩 서비스 사용
 * 무료이며 인증 불필요, CORS 제한 없음
 */

export interface GeocoderAddress {
  roadAddress: string | null; // 도로명주소
  jibunAddress: string; // 지번주소
  region1: string; // 시/도
  region2: string; // 시/군/구
  region3: string; // 읍/면/동
}

interface NominatimAddress {
  road?: string;
  suburb?: string;
  city?: string;
  county?: string;
  state?: string;
  village?: string;
  town?: string;
  municipality?: string;
  city_district?: string;
  province?: string;
  quarter?: string; // 한국 주소: 동/읍/면
  borough?: string; // 한국 주소: 구
}

interface NominatimResponse {
  address: NominatimAddress;
  display_name: string;
}

/**
 * 좌표를 주소로 변환 (역지오코딩)
 * Nominatim OpenStreetMap API 사용
 * @param longitude 경도
 * @param latitude 위도
 * @returns Promise<GeocoderAddress | null>
 */
export const coord2Address = async (
  longitude: number,
  latitude: number
): Promise<GeocoderAddress | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ko`,
      {
        headers: {
          "User-Agent": "WeatherApp/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("지오코딩 실패");
    }

    const data: NominatimResponse = await response.json();
    const addr = data.address;

    // 한국 주소 구조에 맞게 파싱
    // city: 대전광역시, 충청남도 등 (시/도급)
    // borough: 동구, 서구 등 (구급)
    // county: 공주시, 논산시 등 (시/군급)
    // quarter: 자양동, 신관동 등 (읍/면/동급)
    const region1 = addr.city || addr.province || addr.state || ""; // 시/도
    const region2 =
      addr.borough ||
      addr.county ||
      addr.municipality ||
      addr.city_district ||
      ""; // 시/군/구
    const region3 =
      addr.quarter || addr.suburb || addr.town || addr.village || ""; // 읍/면/동

    return {
      roadAddress: addr.road || null,
      jibunAddress: data.display_name,
      region1,
      region2,
      region3,
    };
  } catch (error) {
    console.error("역지오코딩 오류:", error);
    return null;
  }
};

/**
 * 주소 문자열을 좌표로 변환 (정지오코딩)
 * Nominatim OpenStreetMap API 사용
 * @param address 주소 문자열 (예: "서울특별시 종로구 청운동")
 * @returns Promise<{latitude: number, longitude: number} | null>
 */
export const address2Coord = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    if (!address || address.trim().length === 0) {
      return null;
    }

    // 한국 지역으로 제한하여 검색
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=kr&addressdetails=1&accept-language=ko&limit=1`,
      {
        headers: {
          "User-Agent": "WeatherApp/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("지오코딩 오류");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  } catch (error) {
    console.error("지오코딩 오류:", error);
    return null;
  }
};

/**
 * 좌표를 행정구역 코드로 변환
 * @param longitude 경도
 * @param latitude 위도
 * @returns Promise<string | null> - "시/군/구 읍/면/동" 형식
 */
export const coord2RegionCode = async (
  longitude: number,
  latitude: number
): Promise<string | null> => {
  const address = await coord2Address(longitude, latitude);

  if (!address) {
    return null;
  }

  // region2 (시/군/구) + region3 (읍/면/동) 형식으로 반환
  const displayAddress = address.region3
    ? `${address.region2} ${address.region3}`
    : address.region2;

  return displayAddress || null;
};
