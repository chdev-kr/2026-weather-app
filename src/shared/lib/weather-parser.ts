import type { ShortTermForecastItem } from '../api/weather/types';

/**
 * 기상청 API 응답에서 특정 카테고리 값을 추출하는 함수
 */
export const getValueByCategory = (
  items: ShortTermForecastItem[],
  category: string,
  fcstDate: string,
  fcstTime: string
): string => {
  const item = items.find(
    (item) =>
      item.category === category &&
      item.fcstDate === fcstDate &&
      item.fcstTime === fcstTime
  );
  return item?.fcstValue || '';
};

/**
 * 기상청 API 응답에서 현재 시간 기준 최신 데이터 추출
 */
export const getCurrentWeatherData = (items: ShortTermForecastItem[]) => {
  if (!items || items.length === 0) return null;

  // 첫 번째 예보 시간 가져오기
  const firstItem = items[0];
  const fcstDate = firstItem.fcstDate;
  const fcstTime = firstItem.fcstTime;

  return {
    fcstDate,
    fcstTime,
    tmp: getValueByCategory(items, 'TMP', fcstDate, fcstTime), // 기온
    sky: getValueByCategory(items, 'SKY', fcstDate, fcstTime), // 하늘상태
    pty: getValueByCategory(items, 'PTY', fcstDate, fcstTime), // 강수형태
    pop: getValueByCategory(items, 'POP', fcstDate, fcstTime), // 강수확률
    pcp: getValueByCategory(items, 'PCP', fcstDate, fcstTime), // 1시간 강수량
    reh: getValueByCategory(items, 'REH', fcstDate, fcstTime), // 습도
    wsd: getValueByCategory(items, 'WSD', fcstDate, fcstTime), // 풍속
  };
};

/**
 * 특정 날짜의 최저/최고 기온 추출
 */
export const getMinMaxTemp = (
  items: ShortTermForecastItem[],
  targetDate: string
) => {
  const tmnItem = items.find(
    (item) => item.category === 'TMN' && item.fcstDate === targetDate
  );
  const tmxItem = items.find(
    (item) => item.category === 'TMX' && item.fcstDate === targetDate
  );

  return {
    min: tmnItem?.fcstValue || '',
    max: tmxItem?.fcstValue || '',
  };
};

/**
 * 시간별 예보 데이터 추출 (현재 시각 이후 24시간)
 */
export const getHourlyForecast = (
  items: ShortTermForecastItem[],
  targetDate: string,
  hours: number = 24
) => {
  // 날짜+시간별로 그룹화 (날짜 구분 없이 전체 데이터 사용)
  const timeSlots = items
    .map((item) => ({
      dateTime: `${item.fcstDate}-${item.fcstTime}`,
      date: item.fcstDate,
      time: item.fcstTime,
    }))
    .filter((v, i, a) => a.findIndex(t => t.dateTime === v.dateTime) === i)
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));

  // 현재 시각 이후의 데이터만 필터링
  const now = new Date();
  const currentDateTime = `${targetDate}-${String(now.getHours()).padStart(2, '0')}00`;

  const futureSlots = timeSlots
    .filter(slot => slot.dateTime >= currentDateTime)
    .slice(0, hours);

  return futureSlots.map((slot) => {
    // HHMM 형식을 HH:MM 형식으로 변환
    const formattedTime = `${slot.time.slice(0, 2)}:${slot.time.slice(2, 4)}`;

    return {
      time: formattedTime,
      TMP: getValueByCategory(items, 'TMP', slot.date, slot.time),
      SKY: getValueByCategory(items, 'SKY', slot.date, slot.time),
      PTY: getValueByCategory(items, 'PTY', slot.date, slot.time),
      POP: getValueByCategory(items, 'POP', slot.date, slot.time),
    };
  });
};

/**
 * 하늘 상태 코드를 문자열로 변환
 * 1: 맑음, 3: 구름많음, 4: 흐림
 */
export const getSkyCondition = (skyCode: string): string => {
  switch (skyCode) {
    case '1':
      return '맑음';
    case '3':
      return '구름많음';
    case '4':
      return '흐림';
    default:
      return '';
  }
};

/**
 * 강수 형태 코드를 문자열로 변환
 * 0: 없음, 1: 비, 2: 비/눈, 3: 눈, 5: 빗방울, 6: 빗방울눈날림, 7: 눈날림
 */
export const getPrecipitationType = (ptyCode: string): string => {
  switch (ptyCode) {
    case '0':
      return '없음';
    case '1':
      return '비';
    case '2':
      return '비/눈';
    case '3':
      return '눈';
    case '5':
      return '빗방울';
    case '6':
      return '빗방울눈날림';
    case '7':
      return '눈날림';
    default:
      return '';
  }
};

/**
 * 단기예보에서 일별 데이터 추출 (오늘부터 3일 후까지)
 * WeeklyForecast 형식에 맞춰 반환
 */
export const getDailyForecastFromShortTerm = (
  items: ShortTermForecastItem[]
) => {
  if (!items || items.length === 0) return [];

  const today = new Date();
  const dailyData = [];

  // 오늘부터 3일 후까지 4일간의 데이터 추출 (중기예보는 4일 후부터 시작)
  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + dayOffset);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;

    // 해당 날짜의 모든 시간대 데이터 가져오기
    const dayItems = items.filter(item => item.fcstDate === dateString);

    if (dayItems.length === 0) continue;

    // 오전(06:00~11:00), 오후(12:00~18:00) 시간대로 분류
    const morningItems = dayItems.filter(item => {
      const hour = parseInt(item.fcstTime.slice(0, 2));
      return hour >= 6 && hour <= 11;
    });
    const afternoonItems = dayItems.filter(item => {
      const hour = parseInt(item.fcstTime.slice(0, 2));
      return hour >= 12 && hour <= 18;
    });

    // 오전/오후 대표 날씨 추출 (가장 빈번한 SKY/PTY 값 사용)
    const getRepresentativeWeather = (timeItems: ShortTermForecastItem[]) => {
      const skyItems = timeItems.filter(item => item.category === 'SKY');
      const ptyItems = timeItems.filter(item => item.category === 'PTY');
      const popItems = timeItems.filter(item => item.category === 'POP');

      // 가장 흐린 하늘 상태 선택 (숫자가 클수록 흐림)
      const skyValues = skyItems.map(item => parseInt(item.fcstValue));
      const maxSky = skyValues.length > 0 ? Math.max(...skyValues) : 1;

      // 가장 강한 강수 형태 선택
      const ptyValues = ptyItems.map(item => parseInt(item.fcstValue));
      const maxPty = ptyValues.length > 0 ? Math.max(...ptyValues) : 0;

      // 최대 강수 확률
      const popValues = popItems.map(item => parseInt(item.fcstValue));
      const maxPop = popValues.length > 0 ? Math.max(...popValues) : 0;

      return { sky: maxSky, pty: maxPty, pop: maxPop };
    };

    const morningWeather = getRepresentativeWeather(morningItems);
    const afternoonWeather = getRepresentativeWeather(afternoonItems);

    // 날씨를 텍스트로 변환
    const weatherToText = (pty: number, sky: number) => {
      if (pty === 1) return '비';
      if (pty === 2) return '비/눈';
      if (pty === 3) return '눈';
      if (pty === 5) return '빗방울';
      if (pty === 6) return '빗방울눈날림';
      if (pty === 7) return '눈날림';
      if (sky === 1) return '맑음';
      if (sky === 3) return '구름많음';
      if (sky === 4) return '흐림';
      return '맑음';
    };

    // 최저/최고 기온
    const minMaxTemp = getMinMaxTemp(items, dateString);

    // 오늘의 경우 TMN/TMX가 없을 수 있으므로 TMP 값으로 대체
    let taMin = minMaxTemp.min;
    let taMax = minMaxTemp.max;

    if (!taMin || !taMax) {
      // TMP 값들 중에서 최저/최고 찾기
      const tmpItems = dayItems.filter(item => item.category === 'TMP');
      const tmpValues = tmpItems.map(item => parseFloat(item.fcstValue));
      if (tmpValues.length > 0) {
        taMin = String(Math.round(Math.min(...tmpValues)));
        taMax = String(Math.round(Math.max(...tmpValues)));
      }
    }

    // 날짜 표기 (M/D 요일 형식)
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][targetDate.getDay()];
    const dateLabel = `${parseInt(month)}/${parseInt(day)} ${dayOfWeek}`;

    dailyData.push({
      date: dateLabel,
      wfAm: weatherToText(morningWeather.pty, morningWeather.sky),
      wfPm: weatherToText(afternoonWeather.pty, afternoonWeather.sky),
      taMin: taMin || '0',
      taMax: taMax || '0',
      rnStAm: String(morningWeather.pop),
      rnStPm: String(afternoonWeather.pop),
    });
  }

  return dailyData;
};

/**
 * 현재 날짜/시간을 기상청 API 형식으로 변환
 * baseDate: YYYYMMDD
 * baseTime: HHmm
 *
 * 단기예보 발표 시각: 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
 */
export const getWeatherApiDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 단기예보 API 발표 시각 (02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10)
  const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];

  // 현재 시각 기준으로 가장 최근 발표 시각 찾기
  let baseHour = -1;

  for (let i = baseHours.length - 1; i >= 0; i--) {
    const targetHour = baseHours[i];
    // 발표 시각 + 10분 이후부터 데이터 사용 가능
    // 예: 14:10 발표 -> 14:10 이후 사용 가능
    if (hours > targetHour || (hours === targetHour && minutes >= 10)) {
      baseHour = targetHour;
      break;
    }
  }

  // 전날 23:10 데이터를 사용해야 하는 경우 (02:10 이전)
  if (baseHour === -1) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      baseDate: `${yesterday.getFullYear()}${String(yesterday.getMonth() + 1).padStart(2, '0')}${String(yesterday.getDate()).padStart(2, '0')}`,
      baseTime: '2310',
    };
  }

  const baseTime = `${String(baseHour).padStart(2, '0')}10`;
  const baseDate = `${year}${month}${day}`;

  return {
    baseDate,
    baseTime,
  };
};
