import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

function RedirectToSignIn() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      // Build redirect URL with returnTo and platform parameters
      const accountsCenterUrl = import.meta.env.VITE_ACCOUNTS_CENTER;
      const currentUrl = window.location.href;
      const redirectUrl = `${accountsCenterUrl}/sign-in?platform=candidate&returnTo=${encodeURIComponent(currentUrl)}`;
      
      window.location.href = redirectUrl;
    }
  }, [isPending, session, navigate]);

  return null;
}

export default RedirectToSignIn;
