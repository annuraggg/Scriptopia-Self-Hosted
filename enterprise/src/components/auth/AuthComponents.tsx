import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/contexts/useAuth";

interface SignedInProps {
  children: ReactNode;
}

interface SignedOutProps {
  children: ReactNode;
}

interface RedirectToSignInProps {
  redirectUrl?: string;
}

export function SignedIn({ children }: SignedInProps) {
  const { data: session } = authClient.useSession();
  return session ? <>{children}</> : null;
}

export function SignedOut({ children }: SignedOutProps) {
  const { data: session } = authClient.useSession();
  return !session ? <>{children}</> : null;
}

export function RedirectToSignIn({ redirectUrl }: RedirectToSignInProps) {
  const accountsUrl = import.meta.env.VITE_ACCOUNTS_URL || "http://localhost:5001";
  const currentUrl = redirectUrl || window.location.href;
  
  // Redirect to accounts app with return URL
  window.location.href = `${accountsUrl}/sign-in?redirect=${encodeURIComponent(currentUrl)}`;
  
  return null;
}

export function SignOutButton({ children }: { children?: ReactNode }) {
  const handleSignOut = () => {
    authClient.signOut();
  };

  return (
    <button onClick={handleSignOut} className="text-sm">
      {children || "Sign out"}
    </button>
  );
}

export function UserButton() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
        {user.email?.charAt(0).toUpperCase() || "U"}
      </div>
      <span className="text-sm">{user.email}</span>
      <SignOutButton />
    </div>
  );
}

// Hook to provide useUser functionality
export function useUser() {
  const { user } = useAuth();
  return { user, isSignedIn: !!user };
}