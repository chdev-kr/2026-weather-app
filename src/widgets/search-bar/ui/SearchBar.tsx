import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo, useRef, useEffect } from "react";
import koreaDistricts from "@/shared/data/korea_districts.json";
import { address2Coord } from "@/shared/lib/nominatim-geocoder";
import { useLocationStore } from "@/shared/store/useLocationStore";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentLocation } = useLocationStore();
  const searchRef = useRef<HTMLDivElement>(null);

  // korea_districts.json에서 검색어에 맞는 주소 필터링
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const query = searchTerm.trim();

    // 검색어와 일치하는 주소를 찾기
    const results = koreaDistricts
      .filter((district: string) => {
        return district.includes(query);
      })
      .slice(0, 15); // 최대 15개 표시

    return results;
  }, [searchTerm]);

  // 검색 결과 클릭 시 해당 위치로 이동
  const handleSelectAddress = async (address: string) => {
    setIsLoading(true);

    try {
      // 하이픈을 공백으로 변환 (서울특별시-성동구 → 서울특별시 성동구)
      const formattedAddress = address.replace(/-/g, " ");

      // 주소를 좌표로 변환
      const coords = await address2Coord(formattedAddress);

      if (coords) {
        setCurrentLocation({
          address: formattedAddress,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        // 검색창 초기화
        setSearchTerm("");
      } else {
        alert("주소를 찾을 수 없습니다. 다른 주소를 시도해주세요.");
      }
    } catch (error) {
      console.error("주소 검색 오류:", error);
      alert("주소 검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색창 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="날씨가 궁금한 지역을 검색해주세요 예) 서울특별시, 마포구, 동교동"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-6 text-base"
          disabled={isLoading}
        />
      </div>

      {searchResults.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-10 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <CardContent className="p-0">
            {searchResults.map((district, index) => {
              // 하이픈을 공백으로 변환하여 표시
              const displayAddress = district.replace(/-/g, " ");

              return (
                <div
                  key={index}
                  onClick={() => handleSelectAddress(district)}
                  className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{displayAddress}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {searchTerm && searchResults.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-10">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              검색 결과가 없습니다.
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="absolute top-full mt-2 w-full z-10">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              위치를 불러오는 중...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
