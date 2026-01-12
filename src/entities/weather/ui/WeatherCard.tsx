import { Card, CardContent } from "@/components/ui/card";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Droplets,
  Check,
  X,
  Pencil,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";

interface WeatherCardProps {
  id?: number | string; // 위치 ID (선택) - 숫자 또는 UUID 문자열
  location: string; // 지역명
  temperature: string; // 현재 온도
  tempMin?: string; // 최저 온도 (선택)
  tempMax?: string; // 최고 온도 (선택)
  sky: string; // 하늘 상태 (1:맑음, 3:구름많음, 4:흐림)
  pty: string; // 강수형태 (0:없음, 1:비, 2:비/눈, 3:눈)
  pop?: string; // 강수확률 (선택)
  isLoading?: boolean; // 로딩 상태
}

export const WeatherCard = ({
  id,
  location,
  temperature,
  tempMin,
  tempMax,
  sky,
  pty,
  pop,
  isLoading = false,
}: WeatherCardProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState(location);
  const { removeFavorite, favorites } = useFavoritesStore();

  const handleLocationSave = () => {
    setIsEditing(false);
  };

  const handleLocationCancel = () => {
    setEditedLocation(location);
    setIsEditing(false);
  };

  const handleCardClick = () => {
    // 편집 모드가 아닐 때만 네비게이션
    if (!isEditing && id) {
      navigate(`/weather/${id}`);
    }
  };

  // 즐겨찾기 삭제
  const handleRemoveFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!id) return;

    // id가 UUID 문자열이면 그대로 사용
    if (typeof id === "string") {
      if (window.confirm(`${location}을(를) 즐겨찾기에서 삭제하시겠습니까?`)) {
        removeFavorite(id);
      }
    } else {
      // id가 숫자면 favorites에서 찾기
      const favorite = favorites[id - 1]; // 1부터 시작하므로 -1
      if (favorite) {
        if (
          window.confirm(`${location}을(를) 즐겨찾기에서 삭제하시겠습니까?`)
        ) {
          removeFavorite(favorite.id);
        }
      }
    }
  };

  // 날씨 아이콘 선택 함수
  const getWeatherIcon = () => {
    if (pty !== "0") {
      if (pty === "1") return <CloudRain className="w-12 h-12" />;
      if (pty === "3") return <CloudSnow className="w-12 h-12" />;
      return <CloudRain className="w-12 h-12" />;
    }
    if (sky === "1") return <Sun className="w-12 h-12" />;
    return <Cloud className="w-12 h-12" />;
  };

  // 날씨 텍스트 함수
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

  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <Card className="bg-muted/50 min-w-70 relative animate-pulse">
        {/* 삭제 버튼 스켈레톤 */}
        {id && (
          <div className="absolute top-2 right-2 h-6 w-6 bg-muted rounded-full" />
        )}

        <CardContent className="py-3 px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* 위치 이름 스켈레톤 */}
              <div className="h-5 w-24 bg-muted rounded" />

              {/* 온도 스켈레톤 */}
              <div className="h-8 w-16 bg-muted rounded" />

              {/* 최저/최고 온도 스켈레톤 */}
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-4 w-1 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>

              {/* 강수확률 스켈레톤 */}
              {pop && <div className="h-4 w-16 bg-muted rounded" />}
            </div>

            {/* 날씨 아이콘 스켈레톤 */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="h-3 w-12 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-muted/50 transition-colors min-w-70 relative ${
        !isEditing ? "cursor-pointer hover:bg-muted/70" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* 즐겨찾기 삭제 버튼 (오른쪽 상단) */}
      {id && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 z-10 hover:bg-destructive/10"
          onClick={handleRemoveFavorite}
        >
          <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      )}

      <CardContent className="py-3 px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {isEditing ? (
                <>
                  <Input
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="h-7 text-sm font-semibold"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={handleLocationSave}
                  >
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={handleLocationCancel}
                  >
                    <X className="w-3.5 h-3.5 text-red-600" />
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold truncate">
                    {editedLocation}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>

            <div className="text-2xl font-bold">{temperature}°</div>

            {tempMin && tempMax && (
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <div className="flex items-center gap-0.5 text-blue-600">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>{tempMin}°</span>
                </div>
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-0.5 text-red-600">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{tempMax}°</span>
                </div>
              </div>
            )}

            {/* 강수확률 */}
            {pop && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Droplets className="w-3 h-3" />
                <span>{pop}%</span>
              </div>
            )}
          </div>

          {/* 오른쪽: 날씨 아이콘과 텍스트 */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div>
              {pty !== "0" ? (
                pty === "1" ? (
                  <CloudRain className="w-12 h-12 text-blue-500" />
                ) : pty === "3" ? (
                  <CloudSnow className="w-12 h-12 text-blue-300" />
                ) : (
                  <CloudRain className="w-12 h-12 text-blue-500" />
                )
              ) : sky === "1" ? (
                <Sun className="w-12 h-12 text-yellow-500" />
              ) : (
                <Cloud className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {getWeatherText()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
