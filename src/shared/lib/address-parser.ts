/**
 * 주소를 파싱하여 "구 동" 형식으로 반환
 * 예: "서울특별시 중랑구 면목동" → "중랑구 면목동"
 * 예: "동구 자양동" → "동구 자양동" (이미 짧은 형식이면 그대로 반환)
 *
 * HomePage의 파싱 로직과 동일하게 동작
 */
export const parseAddressToShortForm = (address: string): string => {
  const parts = address.split(' ');

  // 이미 2개 이하의 부분만 있으면 (이미 짧은 형식) 그대로 반환
  if (parts.length <= 2) {
    return address;
  }

  // parts[0]은 시/도이므로 parts[1]부터 사용
  // "서울특별시 중랑구 면목동" -> "중랑구 면목동"
  const province = parts[1] || "";
  const district = parts[2] || "";

  if (district) {
    return `${province} ${district}`;
  }

  return province || address;
};
