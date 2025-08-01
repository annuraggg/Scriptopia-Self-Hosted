import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/forgot/Forgotpassword";
import VerifyEmail from "./pages/verify-email/VerifyEmail";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

function App() {
  const basename = import.meta.env.VITE_BASENAME || "/";

  const router = createBrowserRouter(
    [
      { path: "/", element: <Navigate to="/sign-in" /> },
      { path: "/sign-in", element: <Signin /> },
      { path: "/sign-up", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "*", element: <Navigate to="/sign-in" /> },
    ],
    { basename }
  );

  return <RouterProvider router={router} />;
}

export default App;
