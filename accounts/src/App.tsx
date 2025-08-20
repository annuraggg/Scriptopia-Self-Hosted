import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/forgot/Forgotpassword";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import NotFound from "./pages/404/NotFound";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

function App() {
  const basename = import.meta.env.VITE_BASENAME || "/";

  const handleNavigate = (path: string) => {
    window.location.href = `${basename}${path}`;
  };

  const router = createBrowserRouter(
    [
      { path: "/", element: <Navigate to="/sign-in" /> },
      { path: "/sign-in", element: <Signin onNavigate={handleNavigate} /> },
      { path: "/sign-up", element: <Signup onNavigate={handleNavigate} /> },
      { path: "/forgot-password", element: <ForgotPassword onNavigate={handleNavigate} /> },
      { path: "/verify-email", element: <VerifyEmail onNavigate={handleNavigate} /> },
      { path: "*", element: <NotFound onNavigate={handleNavigate} /> },
    ],
    { basename }
  );

  return <RouterProvider router={router} />;
}

export default App;
