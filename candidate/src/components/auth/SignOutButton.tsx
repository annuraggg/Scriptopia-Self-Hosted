interface SignOutButtonProps {
  children?: React.ReactNode;
  signOutOptions?: {
    redirectUrl?: string;
  };
}

export const SignOutButton = ({
  children = "Sign out",
  signOutOptions,
}: SignOutButtonProps) => {
  const redirectUrl = signOutOptions?.redirectUrl || "/";

  const handleSignOut = () => {
    localStorage.removeItem("token"); // or clear cookies/session/etc.

    // Optionally clear auth context if needed
    // setUser(null); or useAuth().logout()

    // Prefer hard refresh to fully reset app state
    window.location.href = redirectUrl;
    // OR for SPA: navigate(redirectUrl);
  };

  return (
    <button onClick={handleSignOut} className="text-red-600 hover:underline">
      {children}
    </button>
  );
};
