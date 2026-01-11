// 기상청 API 응답 타입 정의

// 단기예보 API 응답 타입
export interface ShortTermForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: ShortTermForecastItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface ShortTermForecastItem {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

// 중기예보 API 응답 타입 (육상예보)
export interface MidTermLandForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: MidTermLandForecastItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface MidTermLandForecastItem {
  regId: string;
  rnSt3Am: number;
  rnSt3Pm: number;
  rnSt4Am: number;
  rnSt4Pm: number;
  rnSt5Am: number;
  rnSt5Pm: number;
  rnSt6Am: number;
  rnSt6Pm: number;
  rnSt7Am: number;
  rnSt7Pm: number;
  rnSt8: number;
  rnSt9: number;
  rnSt10: number;
  wf3Am: string;
  wf3Pm: string;
  wf4Am: string;
  wf4Pm: string;
  wf5Am: string;
  wf5Pm: string;
  wf6Am: string;
  wf6Pm: string;
  wf7Am: string;
  wf7Pm: string;
  wf8: string;
  wf9: string;
  wf10: string;
}

// 중기예보 API 응답 타입 (기온예보)
export interface MidTermTemperatureForecastResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: MidTermTemperatureForecastItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

export interface MidTermTemperatureForecastItem {
  regId: string;
  taMin3: number;
  taMin4: number;
  taMin5: number;
  taMin6: number;
  taMin7: number;
  taMin8: number;
  taMin9: number;
  taMin10: number;
  taMax3: number;
  taMax4: number;
  taMax5: number;
  taMax6: number;
  taMax7: number;
  taMax8: number;
  taMax9: number;
  taMax10: number;
}

// 기상청 카테고리 코드
export type WeatherCategory =
  | 'POP' // 강수확률
  | 'PTY' // 강수형태
  | 'PCP' // 1시간 강수량
  | 'REH' // 습도
  | 'SNO' // 1시간 신적설
  | 'SKY' // 하늘상태
  | 'TMP' // 1시간 기온
  | 'TMN' // 일 최저기온
  | 'TMX' // 일 최고기온
  | 'UUU' // 풍속(동서성분)
  | 'VVV' // 풍속(남북성분)
  | 'WAV' // 파고
  | 'VEC' // 풍향
  | 'WSD'; // 풍속

// 격자 좌표
export interface GridCoordinate {
  nx: number;
  ny: number;
}

// GPS 좌표
export interface GpsCoordinate {
  latitude: number;
  longitude: number;
}
