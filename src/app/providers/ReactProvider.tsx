import { HomePage } from "@/pages/home/ui/HomePage";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { WeatherDetail } from "@/pages/weather-detail/ui/WeatherDetail";
import {
  createBrowserRouter,
  RouterProvider as Router,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/weather/:id",
    element: <WeatherDetail />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const RouterProvider = () => {
  return <Router router={router} />;
};
