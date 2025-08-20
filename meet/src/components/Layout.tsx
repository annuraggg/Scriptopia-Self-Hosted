import { useAuth } from "@/contexts/useAuth";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to accounts if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = process.env.ACCOUNTS_FRONTEND_URL || "/login";
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? (
        <Outlet />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Layout;
