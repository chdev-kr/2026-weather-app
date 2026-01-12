import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/widgets/header/ui/Header";
import { Footer } from "@/widgets/footer/ui/Footer";
import { CloudOff, Home, ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  return (
    <>
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          {/* 404 아이콘 */}
          <div className="flex justify-center">
            <div className="relative">
              <CloudOff className="w-24 h-24 text-muted-foreground" />
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-2 border-2 border-muted">
                <span className="text-2xl font-bold text-muted-foreground">404</span>
              </div>
            </div>
          </div>

          {/* 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h1>
            <p className="text-muted-foreground">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {canGoBack && (
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                이전 페이지
              </Button>
            )}
            <Button
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로 이동
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
