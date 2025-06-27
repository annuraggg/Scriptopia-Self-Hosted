import { Context } from "hono";
import { sendError, sendSuccess } from "../../../utils/sendResponse";
import Organization from "../../../models/Organization";
import logger from "../../../utils/logger";
import { Member } from "@shared-types/Organization";
import User from "@/models/User";

const getNotifications = async (c: Context) => {
  try {
    const auth = c.get("auth");
    const currentUser = await User.findOne({ _id: auth._id }).lean();

    const organization = await Organization.findOne({
      _id: currentUser?.publicMetadata.orgId,
    });

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    const user = organization.members.find(
      (member) => (member as unknown as Member).user === auth._id
    );

    if (!user) {
      return sendError(c, 401, "Unauthorized");
    }

    const notifications = user.notifications;
    return sendSuccess(
      c,
      200,
      "Notifications fetched successfully",
      notifications
    );
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

const readNotification = async (c: Context) => {
  try {
    const { id } = await c.req.json();
    const auth = c.get("auth");

    const currentUser = await User.findOne({ _id: auth._id }).lean();
    const organization = await Organization.findOne({
      _id: currentUser?.publicMetadata.orgId,
    });

    if (!organization) {
      return sendError(c, 404, "Organization not found");
    }

    const user = organization.members.find(
      (member) => (member as unknown as Member).user === auth._id
    );

    if (!user) {
      return sendError(c, 401, "Unauthorized");
    }

    const notification = user.notifications.find(
      (notif) => notif._id?.toString() === id.toString()
    );
    if (!notification) {
      return sendError(c, 404, "Notification not found");
    }

    notification.read = true;
    await organization.save();

    return sendSuccess(c, 200, "Notification marked as read");
  } catch (error) {
    logger.error(error as string);
    return sendError(c, 500, "Internal Server Error");
  }
};

export default {
  getNotifications,
  readNotification,
};
