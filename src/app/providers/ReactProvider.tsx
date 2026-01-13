import { lazy, Suspense } from "react";
import { ScrollToTop } from "@/shared/lib/ScrollToTop";
import {
  createBrowserRouter,
  RouterProvider as Router,
} from "react-router-dom";

// Lazy load pages
const HomePage = lazy(() =>
  import("@/pages/home/ui/HomePage").then((module) => ({
    default: module.HomePage,
  }))
);
const WeatherDetail = lazy(() =>
  import("@/pages/weather-detail/ui/WeatherDetail").then((module) => ({
    default: module.WeatherDetail,
  }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found/ui/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
);

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      </>
    ),
  },
  {
    path: "/weather/:id",
    element: (
      <>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <WeatherDetail />
        </Suspense>
      </>
    ),
  },
  {
    path: "*",
    element: (
      <>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <NotFoundPage />
        </Suspense>
      </>
    ),
  },
]);

export const RouterProvider = () => {
  return <Router router={router} />;
};
