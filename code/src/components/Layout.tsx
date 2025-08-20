import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [refetch, setRefetch] = useState(false);

  // Redirect to accounts if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = process.env.ACCOUNTS_FRONTEND_URL || "/login";
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Navbar refetch={refetch} />
          <div className="h-[88vh] px-10">
            <Outlet context={{ setRefetch }} />
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Layout;
