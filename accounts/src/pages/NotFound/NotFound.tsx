import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">404 — Page not found</h1>
      <p className="opacity-70">The page you're looking for doesn't exist.</p>
      <Link className="text-purple-600 hover:underline" to="/sign-in">
        Go to Sign in
      </Link>
    </div>
  );
}