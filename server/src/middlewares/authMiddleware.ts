import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import { sendError } from "../utils/sendResponse";
import { auth } from "@/config/betterauth";

const authMiddleware = createMiddleware(async (c: Context, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const AuthHeader = await c.req.header("Authorization")

  console.log("Auth Header:", AuthHeader);

  if (!session) {
    c.set("auth", null);
    return next();
  }

  const credentials = {
    user: session.user,
    session: session.session,
    _id: session.user.id,
  };

  c.set("auth", credentials);

  if (c.req.path === "/health") return next();
  if (c.req.path.startsWith("/submissions")) return next();
  if (c.req.path.startsWith("/users")) return next();
  if (c.req.path.startsWith("/ws")) return next();
  if (c.req.path.startsWith("/socket.io")) return next();

  if (c.req.path.startsWith("/assessments/verify")) return next();
  if (c.req.path.startsWith("/assessments/code/submit")) return next();
  if (c.req.path.startsWith("/assessments/submit/mcq")) return next();
  if (c.req.path.startsWith("/assessments/code/check-progress")) return next();
  if (c.req.path.startsWith("/assessments/mcq/check-progress")) return next();

  if (!auth) {
    return sendError(c, 401, "Request Unauthorized");
  }

  return next();
});

export default authMiddleware;
