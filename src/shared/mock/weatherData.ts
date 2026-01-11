// 목데이터

// 단기예보 (Short-term forecast) - 현재 날씨 + 시간별 예보
export const mockShortTermWeather = {
  location: "서울특별시 종로구",
  baseDate: "20260108",
  baseTime: "1400",
  current: {
    TMP: "3", // 온도
    SKY: "1", // 하늘상태(1:맑음, 3:구름많음, 4:흐림)
    PTY: "0", // 강수형태(0:없음, 1:비, 2:비/눈, 3:눈, 4:소나기)
    POP: "20", // 강수확률(%)
    REH: "45", // 습도(%)
    WSD: "2.5", // 풍속(m/s)
  },
  hourly: [
    { time: "14:00", TMP: "3", SKY: "1", PTY: "0", POP: "20" },
    { time: "15:00", TMP: "4", SKY: "1", PTY: "0", POP: "10" },
    { time: "16:00", TMP: "3", SKY: "1", PTY: "0", POP: "10" },
    { time: "17:00", TMP: "2", SKY: "1", PTY: "0", POP: "10" },
    { time: "18:00", TMP: "1", SKY: "2", PTY: "0", POP: "20" },
    { time: "19:00", TMP: "0", SKY: "2", PTY: "0", POP: "20" },
    { time: "20:00", TMP: "-1", SKY: "3", PTY: "0", POP: "30" },
    { time: "21:00", TMP: "-2", SKY: "3", PTY: "0", POP: "30" },
    { time: "22:00", TMP: "-2", SKY: "3", PTY: "0", POP: "30" },
    { time: "23:00", TMP: "-3", SKY: "3", PTY: "0", POP: "30" },
  ],
  daily: [
    { date: "01/08", TMN: "-5", TMX: "5", SKY: "1", PTY: "0", POP: "20" },
    { date: "01/09", TMN: "-4", TMX: "6", SKY: "3", PTY: "0", POP: "30" },
    { date: "01/10", TMN: "-3", TMX: "7", SKY: "3", PTY: "0", POP: "40" },
  ],
};

// 중기예보 (Mid-term forecast) - 주간 예보
export const mockMidTermWeather = {
  location: "서울특별시 종로구",
  regId: "11B00000",
  weekly: [
    {
      date: "01/11",
      wfAm: "맑음", // 오전 날씨
      wfPm: "구름많음", // 오후 날씨
      taMin: "-4", // 최저기온
      taMax: "8", // 최고기온
      rnStAm: "20", // 오전 강수확률
      rnStPm: "30", // 오후 강수확률
    },
    {
      date: "01/12",
      wfAm: "구름많음",
      wfPm: "흐림",
      taMin: "-2",
      taMax: "9",
      rnStAm: "30",
      rnStPm: "40",
    },
    {
      date: "01/13",
      wfAm: "흐림",
      wfPm: "흐리고 비",
      taMin: "0",
      taMax: "10",
      rnStAm: "40",
      rnStPm: "60",
    },
    {
      date: "01/14",
      wfAm: "흐리고 비",
      wfPm: "흐림",
      taMin: "1",
      taMax: "8",
      rnStAm: "60",
      rnStPm: "40",
    },
    {
      date: "01/15",
      wfAm: "구름많음",
      wfPm: "맑음",
      taMin: "-2",
      taMax: "7",
      rnStAm: "30",
      rnStPm: "20",
    },
    {
      date: "01/16",
      wfAm: "맑음",
      wfPm: "맑음",
      taMin: "-4",
      taMax: "6",
      rnStAm: "10",
      rnStPm: "10",
    },
    {
      date: "01/17",
      wfAm: "맑음",
      wfPm: "구름많음",
      taMin: "-5",
      taMax: "5",
      rnStAm: "10",
      rnStPm: "20",
    },
  ],
};

export const mockLocations = [
  {
    id: 1,
    province: "서울특별시",
    district: "종로구",
    lat: 37.572,
    lon: 126.9794,
    nx: 60, // 격자 X 좌표
    ny: 127, // 격자 Y 좌표
    regId: "11B00000", // 중기예보 지역코드
  },
  {
    id: 2,
    province: "경기도",
    district: "수원시",
    lat: 37.2636,
    lon: 127.0286,
    nx: 60,
    ny: 121,
    regId: "11B00000",
  },
  {
    id: 3,
    province: "부산광역시",
    district: "해운대구",
    lat: 35.1631,
    lon: 129.1635,
    nx: 99,
    ny: 75,
    regId: "11H20000",
  },
  {
    id: 4,
    province: "제주특별자치도",
    district: "제주시",
    lat: 33.489,
    lon: 126.4983,
    nx: 52,
    ny: 38,
    regId: "11G00000",
  },
  {
    id: 5,
    province: "강원특별자치도",
    district: "강릉시",
    lat: 37.7519,
    lon: 128.8761,
    nx: 92,
    ny: 131,
    regId: "11D20000",
  },
];

// 즐겨찾기 목록
export const mockFavorites = [
  {
    id: 1,
    province: "서울특별시",
    district: "종로구",
    addedAt: "2026-01-08T10:30:00",
  },
  {
    id: 3,
    province: "부산광역시",
    district: "해운대구",
    addedAt: "2026-01-07T15:20:00",
  },
  {
    id: 2,
    province: "경기도",
    district: "수원시",
    addedAt: "2026-01-06T09:15:00",
  },
  {
    id: 4,
    province: "제주특별자치도",
    district: "제주시",
    addedAt: "2026-01-05T14:45:00",
  },
  {
    id: 5,
    province: "강원특별자치도",
    district: "강릉시",
    addedAt: "2026-01-04T11:00:00",
  },
  {
    id: 6,
    province: "대구광역시",
    district: "중구",
    addedAt: "2026-01-03T16:30:00",
  },
];
