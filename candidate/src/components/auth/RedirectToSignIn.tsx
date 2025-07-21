import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

function RedirectToSignIn() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      window.location.href = import.meta.env.VITE_ACCOUNTS_CENTER
    }
  }, [isPending, session, navigate]);

  return null;
}

export default RedirectToSignIn;
