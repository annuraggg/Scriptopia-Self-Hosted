import { Session, User } from "better-auth";

declare module "hono" {
  interface ContextVariableMap {
    auth: {
      user: User;
      session: Session;
      _id: string;
    };
  }
}
