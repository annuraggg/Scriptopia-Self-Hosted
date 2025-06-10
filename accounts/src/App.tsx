import { createBrowserRouter, RouterProvider } from "react-router";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signin/Signup/Signup";

function App() {
  const router = createBrowserRouter([
    { path: "/sign-in", element: <Signin /> },
    { path: "/sign-up", element: <Signup /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
