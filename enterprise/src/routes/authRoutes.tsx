import { Suspense, lazy } from "react";
import AuthGuard from "../components/auth/AuthGuard";
import Loader from "../components/Loader";

// Lazy load components
const Start = lazy(() => import("../pages/start/Start"));
const Join = lazy(() => import("../pages/join/Join"));
const Onboarding = lazy(() => import("../pages/onboarding/Onboarding"));

const authRoutes = [
  {
    path: "/start",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard>
          <Start />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard>
          <Onboarding />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: "/join",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthGuard>
          <Join />
        </AuthGuard>
      </Suspense>
    ),
  },
];

export default authRoutes;
