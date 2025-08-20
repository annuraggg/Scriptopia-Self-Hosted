
import "./App.css";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOrganization } from "./reducers/organizationReducer";
import { useAuth } from "@/contexts/useAuth";
import router from "./routes";

function App() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  // Sync user data with Redux
  useEffect(() => {
    if (isAuthenticated && user) {
      const data = {
        _id: user?.publicMetadata?.orgId,
        role: user?.publicMetadata?.orgRole,
        permissions: user?.publicMetadata?.orgPermissions,
        name: user?.publicMetadata?.orgName,
      };
      dispatch(setOrganization(data));
    }
  }, [isAuthenticated, user, dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
