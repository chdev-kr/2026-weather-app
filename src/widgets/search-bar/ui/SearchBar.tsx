import { Search, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useRef, useEffect } from "react";
import koreaDistricts from "@/shared/data/korea_districts.json";
import { address2Coord } from "@/shared/lib/nominatim-geocoder";
import { useLocationStore } from "@/shared/store/useLocationStore";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import { toast } from "sonner";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { setCurrentLocation } = useLocationStore();
  const { addFavorite, isFavorite } = useFavoritesStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // korea_districts.json에서 검색어에 맞는 주소 필터링
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const query = searchTerm.trim();
    // 공백을 하이픈으로 변환하여 검색 (동구 자양동 -> 동구-자양동)
    const queryWithHyphen = query.replace(/\s+/g, "-");

    // 검색어와 일치하는 주소를 찾기
    const results = koreaDistricts
      .filter((district: string) => {
        // 원본 검색어와 하이픈 변환 검색어 둘 다 검색
        return district.includes(query) || district.includes(queryWithHyphen);
      })
      .slice(0, 15); // 최대 15개 표시

    return results;
  }, [searchTerm]);

  // 검색 결과가 바뀌면 선택 인덱스 초기화
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // 선택된 항목이 바뀌면 스크롤
  useEffect(() => {
    if (selectedItemRef.current && selectedIndex >= 0) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

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
        setSelectedIndex(-1);
      } else {
        toast.error("주소를 찾을 수 없습니다. 다른 주소를 시도해주세요.");
      }
    } catch (error) {
      console.error("주소 검색 오류:", error);
      toast.error("주소 검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 즐겨찾기 추가
  const handleAddFavorite = async (
    address: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    const formattedAddress = address.replace(/-/g, " ");

    try {
      // 주소를 좌표로 변환
      const coords = await address2Coord(formattedAddress);

      if (coords) {
        const success = addFavorite({
          name: formattedAddress,
          address: formattedAddress,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        if (success) {
          toast.success("즐겨찾기에 추가되었습니다.");
        }
      } else {
        toast.error("주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("즐겨찾기 추가 오류:", error);
      toast.error("즐겨찾기 추가 중 오류가 발생했습니다.");
    }
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSelectAddress(searchResults[selectedIndex]);
        }
        break;
      case "Escape":
        setSearchTerm("");
        setSelectedIndex(-1);
        break;
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
        setSelectedIndex(-1);
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
          placeholder="날씨가 궁금한 지역을 검색해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-4 py-6 text-base"
          disabled={isLoading}
        />
      </div>

      {searchResults.length > 0 && !isLoading && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-y-auto scrollbar-hide">
          <CardContent className="p-0">
            {searchResults.map((district, index) => {
              // 하이픈을 공백으로 변환하여 표시
              const displayAddress = district.replace(/-/g, " ");
              const isAlreadyFavorite = isFavorite(displayAddress);
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={index}
                  ref={isSelected ? selectedItemRef : null}
                  onClick={() => handleSelectAddress(district)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b last:border-b-0 ${
                    isSelected ? "bg-accent" : "hover:bg-accent"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{displayAddress}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => handleAddFavorite(district, e)}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isAlreadyFavorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {searchTerm && searchResults.length === 0 && !isLoading && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              검색 결과가 없습니다. 해당 장소의 정보가 제공되지 않습니다.
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="absolute top-full mt-2 w-full z-50">
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
