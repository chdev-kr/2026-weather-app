import { Moon, Sun, Monitor, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/shared/store/useThemeStore";

interface HeaderProps {
  showBackButton?: boolean;
}

export const Header = ({ showBackButton = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-5 h-5" />;
    if (theme === "light") return <Sun className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-6xl mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-2">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로가기
            </Button>
          )}
          {!showBackButton && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 cursor-pointer"
            >
              <img
                src="/img/logo.png"
                alt="동그라미 세 개가 모여 구름을 형상화한 모양"
                className="h-10 sm:h-12"
              />
              <div className="px-2 font-bold">웨더온</div>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("default")}>
                <Monitor className="w-4 h-4 mr-2" />
                기본 모드
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="w-4 h-4 mr-2" />
                라이트 모드
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="w-4 h-4 mr-2" />
                다크 모드
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
