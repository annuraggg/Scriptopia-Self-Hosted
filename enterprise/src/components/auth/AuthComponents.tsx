import { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

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