import { authClient } from "@/lib/auth-client";

function SignedIn({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  return session ? <>{children}</> : null;
}

function SignedOut({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  return !session ? <>{children}</> : null;
}

export { SignedIn, SignedOut };
