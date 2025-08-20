// auth-context.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext<{
  user: any;
  isAuthenticated: boolean;
}>({
  user: null,
  isAuthenticated: false,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);