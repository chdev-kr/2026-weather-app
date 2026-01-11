import { Cloud, Clock } from "lucide-react";

interface FooterProps {
  lastUpdate?: string;
}

export const Footer = ({ lastUpdate = "2026-01-09 14:30" }: FooterProps) => {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Cloud className="w-4 h-4" />
            <span>기상청 제공 | @chaehyeon</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>마지막 업데이트: {lastUpdate}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
