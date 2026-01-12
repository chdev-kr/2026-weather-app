import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  MapPin,
  Droplets,
  Star,
  ArrowDown,
  ArrowUp,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import { toast } from "sonner";

interface CurrentWeatherHeroProps {
  location: string;
  temperature: string;
  tempMin: string;
  tempMax: string;
  sky: string;
  pty: string;
  pop: string;
  clickable?: boolean;
  locationId?: string;
  latitude?: number;
  longitude?: number;
  onRefreshLocation?: () => void;
  isLoading?: boolean;
}

export const CurrentWeatherHero = ({
  location,
  temperature,
  tempMin,
  tempMax,
  sky,
  pty,
  pop,
  clickable = false,
  locationId = "1",
  latitude,
  longitude,
  onRefreshLocation,
  isLoading = false,
}: CurrentWeatherHeroProps) => {
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite, favorites } =
    useFavoritesStore();

  const handleClick = () => {
    if (clickable) {
      navigate(`/weather/${locationId}`);
    }
  };

  // 즐겨찾기 토글
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!latitude || !longitude) {
      toast.error("위치 정보를 불러올 수 없습니다.");
      return;
    }

    const isCurrentlyFavorite = isFavorite(location);

    if (isCurrentlyFavorite) {
      // 즐겨찾기에서 삭제
      const favorite = favorites.find((fav) => fav.address === location);
      if (favorite) {
        toast(`${location}을(를) 즐겨찾기에서 삭제하시겠습니까?`, {
          action: {
            label: "삭제",
            onClick: () => {
              removeFavorite(favorite.id);
              toast.success("삭제가 완료되었습니다.");
            },
          },
          cancel: {
            label: "취소",
            onClick: () => {},
          },
        });
      }
    } else {
      // 즐겨찾기에 추가
      const success = addFavorite({
        name: location,
        address: location,
        latitude,
        longitude,
      });

      if (success) {
        toast.success("즐겨찾기에 추가되었습니다.");
      }
    }
  };

  const getWeatherIcon = () => {
    if (pty !== "0") {
      if (pty === "1")
        return <CloudRain className="w-full h-full text-blue-500" />;
      if (pty === "3")
        return <CloudSnow className="w-full h-full text-blue-300" />;
      return <CloudRain className="w-full h-full text-blue-500" />;
    }
    if (sky === "1") return <Sun className="w-full h-full text-yellow-500" />;
    return <Cloud className="w-full h-full text-muted-foreground" />;
  };

  const getWeatherText = () => {
    if (pty !== "0") {
      if (pty === "1") return "비";
      if (pty === "2") return "비/눈";
      if (pty === "3") return "눈";
    }
    if (sky === "1") return "맑음";
    if (sky === "3") return "구름많음";
    return "흐림";
  };

  const isCurrentlyFavorite = isFavorite(location);

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        <h2 className="text-base sm:text-lg font-bold mb-3 px-1">
          현재 위치 날씨
        </h2>
        <Card className="relative border-2 bg-card animate-pulse">
          {/* 우측 상단 버튼 스켈레톤 */}
          <div className="absolute top-3 right-3 z-10 flex gap-1">
            {onRefreshLocation && (
              <div className="w-10 h-10 bg-muted rounded" />
            )}
            <div className="w-10 h-10 bg-muted rounded" />
          </div>

          <CardContent className="pt-6 pb-6 px-8 sm:px-12">
            <div className="flex items-center justify-center gap-10 sm:gap-20">
              {/* 왼쪽: 날씨 아이콘 스켈레톤 */}
              <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>

              {/* 오른쪽: 정보 스켈레톤 */}
              <div className="space-y-2 sm:space-y-3">
                {/* 위치 */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>

                {/* 온도 */}
                <div className="h-14 sm:h-16 w-32 bg-muted rounded" />

                {/* 최저/최고 온도 */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-5 w-16 bg-muted rounded" />
                  <div className="h-5 w-2 bg-muted rounded" />
                  <div className="h-5 w-16 bg-muted rounded" />
                </div>

                {/* 강수확률 */}
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base sm:text-lg font-bold mb-3 px-1">
        현재 위치 날씨
      </h2>
      <Card
        className={`relative border-2 bg-card ${
          clickable ? "cursor-pointer hover:border-3 transition-all" : ""
        }`}
        onClick={handleClick}
      >
        {/* 우측 상단 버튼들 */}
        <div className="absolute top-3 right-3 z-10 flex gap-1">
          {/* 위치 새로고침 버튼 (현재 위치일 때만 표시) */}
          {onRefreshLocation && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRefreshLocation();
              }}
            >
              <RefreshCcw className="w-5 h-5 text-muted-foreground" />
            </Button>
          )}

          {/* 즐겨찾기 버튼 */}
          <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
            <Star
              className={`w-5 h-5 ${
                isCurrentlyFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>

        <CardContent className="pt-6 pb-6 px-8 sm:px-12">
          {/* 좌우 배치 레이아웃 */}
          <div className="flex items-center justify-center gap-10 sm:gap-20">
            {/* 왼쪽: 날씨 아이콘 영역 */}
            <div className="flex flex-col items-center justify-center gap-2 shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                {getWeatherIcon()}
              </div>
              <span className="text-sm sm:text-md text-muted-foreground font-medium">
                {getWeatherText()}
              </span>
            </div>

            {/* 오른쪽: 정보 영역 */}
            <div className="space-y-2 sm:space-y-3">
              {/* 위치 */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold truncate">
                  {location}
                </h3>
              </div>

              {/* 온도 */}
              <div className="text-5xl sm:text-6xl font-bold leading-none">
                {temperature}°
              </div>

              {/* 최저/최고 온도 */}
              <div className="flex items-center gap-2 sm:gap-3 text-md sm:text-base font-bold">
                <div className="flex items-center gap-1 text-blue-600">
                  <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tempMin}°</span>
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tempMax}°</span>
                </div>
              </div>

              {/* 강수확률 */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <span>강수확률 {pop}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
