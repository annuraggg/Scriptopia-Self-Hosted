import { Hono } from "hono";
import userController from "../controllers/code/userController";
import { auth } from "@/config/betterauth";
const app = new Hono();

app.post("/create", userController.userCreated);
app.post("/delete", userController.userDeleted);
app.post("/update", userController.userUpdated);
app.get("/notifications", userController.getNotificationsForUser);
app.post("/notifications/:id", userController.markNotificationAsRead);
// app.post("/record-login", userController?.recordLogin);

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export default app;
