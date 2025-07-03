import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

function RedirectToSignIn() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/sign-in");
    }
  }, [isPending, session, navigate]);

  return null;
}

export default RedirectToSignIn;
