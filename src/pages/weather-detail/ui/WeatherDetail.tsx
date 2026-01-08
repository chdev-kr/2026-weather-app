import { useParams } from "react-router-dom";

export const WeatherDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          날씨 상세 페이지
        </h1>
        <p className="text-gray-600">장소 Id: {id}</p>
      </div>
    </div>
  );
};
