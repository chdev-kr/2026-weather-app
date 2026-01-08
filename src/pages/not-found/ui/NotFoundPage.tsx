import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const [canGoback, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  return (
    <div>
      <div>
        <h1>404</h1>
        <p>페이지를 찾을 수 없습니다.</p>
        <div>
          {canGoback && (
            <button onClick={() => navigate(-1)}>
              {" "}
              이전 페이지로 돌아가기
            </button>
          )}
          <Link to="/"> 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
};
