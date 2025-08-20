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

interface SignOutButtonProps {
  children?: ReactNode;
  signOutOptions?: {
    redirectUrl?: string;
  };
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

export function SignOutButton({ children, signOutOptions }: SignOutButtonProps) {
  const handleSignOut = () => {
    authClient.signOut();
    if (signOutOptions?.redirectUrl) {
      window.location.href = signOutOptions.redirectUrl;
    }
  };

  return (
    <button onClick={handleSignOut} className="text-sm">
      {children || "Sign out"}
    </button>
  );
}

export function UserButton() {
  const { data: session } = authClient.useSession();
  
  if (!session) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
        {session.user.email?.charAt(0).toUpperCase() || "U"}
      </div>
      <span className="text-sm">{session.user.email}</span>
      <SignOutButton />
    </div>
  );
}

// Hook to provide useUser functionality
export function useUser() {
  const { data: session, isPending } = authClient.useSession();
  
  const mappedUser = session?.user ? {
    ...session.user,
    // Clerk compatibility fields
    primaryEmailAddress: {
      emailAddress: session.user.email
    },
    emailAddresses: [{
      emailAddress: session.user.email
    }],
    imageUrl: session.user.image || undefined,
    // Fallback for publicMetadata - this should come from server session customization
    publicMetadata: (session.user as any).publicMetadata || {},
  } : null;
  
  return { 
    user: mappedUser, 
    isSignedIn: !!session,
    isLoaded: !isPending
  };
}