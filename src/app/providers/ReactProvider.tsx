import { HomePage } from "@/pages/home/ui/HomePage";
import { NotFoundPage } from "@/pages/not-found/ui/NotFoundPage";
import { WeatherDetail } from "@/pages/weather-detail/ui/WeatherDetail";
import { ScrollToTop } from "@/shared/lib/ScrollToTop";
import {
  createBrowserRouter,
  RouterProvider as Router,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <HomePage />
      </>
    ),
  },
  {
    path: "/weather/:id",
    element: (
      <>
        <ScrollToTop />
        <WeatherDetail />
      </>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <ScrollToTop />
        <NotFoundPage />
      </>
    ),
  },
]);

export const RouterProvider = () => {
  return <Router router={router} />;
};
