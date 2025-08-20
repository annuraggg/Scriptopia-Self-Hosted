// auth-context.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext<{
  user: any;
  isAuthenticated: boolean;
  getToken: () => Promise<string>;
}>({
  user: null,
  isAuthenticated: false,
  getToken: async () => "",
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return; // wait for session to load
    if (data) {
      setUser(data.user);
    }
  }, [isPending]);

  const getToken = async () => {
    if (data?.session) {
      // BetterAuth session token
      return data.session.token || "";
    }
    return "";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
