import { WeatherCard } from "@/entities/weather/ui/WeatherCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FavoriteLocation {
  id: number | string;
  province: string;
  district: string;
  temperature: string;
  tempMin: string;
  tempMax: string;
  sky: string;
  pty: string;
  pop: string;
  isLoading?: boolean;
}

interface FavoritesListProps {
  favorites: FavoriteLocation[];
}

export const FavoritesList = ({ favorites }: FavoritesListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base sm:text-lg font-semibold px-1">
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
                      isLoading={favorite.isLoading}
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
                isLoading={favorite.isLoading}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
