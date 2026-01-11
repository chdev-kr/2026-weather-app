import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="서울특별시, 종로구, 청운동 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-6 text-base"
        />
      </div>

      {searchTerm && (
        <Card className="absolute top-full mt-2 w-full z-10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 hover:bg-accent cursor-pointer transition-colors">
              <div>
                <p className="text-sm font-medium">서울특별시 종로구</p>
                <p className="text-xs text-muted-foreground">검색 결과 예시</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Star className="w-4 h-4" />
              </Button>
            </div>
            <div className="px-4 py-3 border-t text-xs text-muted-foreground">
              검색 기능은 추후 구현됩니다.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
