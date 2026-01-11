import { WeatherCard } from "@/entities/weather/ui/WeatherCard";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FavoriteLocation {
  id: number;
  province: string;
  district: string;
  temperature: string;
  tempMin: string;
  tempMax: string;
  sky: string;
  pty: string;
  pop: string;
}

interface FavoritesListProps {
  favorites: FavoriteLocation[];
}

export const FavoritesList = ({ favorites }: FavoritesListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold">
            즐겨찾기 ({favorites.length}/6)
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
        {favorites.length < 6 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            장소 추가
          </Button>
        )}
      </div>

      {/* 모바일: 가로 스크롤 / 태블릿+: 그리드 */}
      {isExpanded && (
        <>
          <div className="block sm:hidden">
            {/* 모바일 가로 스크롤 */}
            <div className="overflow-x-auto scrollbar-hide snap-x -mx-3 px-3">
              <div className="flex gap-3 min-w-max">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="snap-start">
                    <WeatherCard
                      id={favorite.id}
                      location={`${favorite.province} ${favorite.district}`}
                      temperature={favorite.temperature}
                      tempMin={favorite.tempMin}
                      tempMax={favorite.tempMax}
                      sky={favorite.sky}
                      pty={favorite.pty}
                      pop={favorite.pop}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 태블릿 이상: 그리드 */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map((favorite) => (
              <WeatherCard
                key={favorite.id}
                id={favorite.id}
                location={`${favorite.province} ${favorite.district}`}
                temperature={favorite.temperature}
                tempMin={favorite.tempMin}
                tempMax={favorite.tempMax}
                sky={favorite.sky}
                pty={favorite.pty}
                pop={favorite.pop}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
