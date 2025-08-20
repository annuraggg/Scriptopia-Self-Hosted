import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

function RedirectToSignIn() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      const url = new URL(import.meta.env.VITE_ACCOUNTS_CENTER as string);
      url.searchParams.set("platform", "candidates");
      window.location.href = url.toString();
    }
  }, [isPending, session, navigate]);

  return null;
}

export default RedirectToSignIn;
