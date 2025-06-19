import React, { useState } from "react";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/forgot/Forgotpassword";
import VerifyEmail from "./pages/verify-email/VerifyEmail";

function App() {
  const [currentPath, setCurrentPath] = useState("/sign-in");

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, "", path);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case "/sign-in":
        return <Signin onNavigate={navigate} />;
      case "/sign-up":
        return <Signup onNavigate={navigate} />;
      case "/forgot-password":
        return <ForgotPassword onNavigate={navigate} />;
      case "/verify-email":
        return <VerifyEmail onNavigate={navigate} />;
      default:
        return <Signin onNavigate={navigate} />;
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    setCurrentPath(window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return <div className="App">{renderCurrentPage()}</div>;
}

export default App;
