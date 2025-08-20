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
      // Map BetterAuth user to Clerk-like format for backward compatibility
      const mappedUser = {
        ...data.user,
        // Clerk compatibility fields
        primaryEmailAddress: {
          emailAddress: data.user.email
        },
        emailAddresses: [{
          emailAddress: data.user.email
        }],
        imageUrl: data.user.image || undefined,
        // Fallback for publicMetadata - this should come from server session customization
        publicMetadata: (data.user as any).publicMetadata || {},
      };
      setUser(mappedUser);
    }
  }, [data, isPending]);

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