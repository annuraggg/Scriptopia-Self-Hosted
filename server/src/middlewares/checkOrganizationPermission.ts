import { sendError } from "../utils/sendResponse";
import { Context } from "hono";
import logger from "../utils/logger";
import { UserMeta } from "@shared-types/UserMeta";
import User from "@/models/User";

interface ReturnType {
  allowed: boolean;
  data: UserMeta | null;
}

class checkOrganizationPermission {
  private static async getUserMeta(_id: string) {
    try {
      const user = await User.findOne({ _id: _id }).lean();
      const perms = user?.publicMetadata as unknown as UserMeta;
      return perms;
    } catch (error) {
      throw new Error("Error retrieving or verifying user Meta");
    }
  }

  static all = async (
    c: Context<any, any, {}>,
    permissions: string[]
  ): Promise<ReturnType> => {
    const auth = await c.get("auth");
    if (!auth?._id) {
      sendError(c, 401, "Unauthorized in checkPermission");
      return { allowed: false, data: null };
    }

    try {
      const userMeta = await checkOrganizationPermission.getUserMeta(
        auth._id
      );

      const hasPermission = permissions.every((permission) =>
        userMeta.organization?.role?.permissions.includes(permission)
      );

      return { allowed: hasPermission, data: userMeta };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };

  static some = async (
    c: Context<any, any, {}>,
    permissions: string[]
  ): Promise<ReturnType> => {
    const auth = await c.get("auth");
    if (!auth?._id) {
      sendError(c, 401, "Unauthorized in checkPermission");
      return { allowed: false, data: null };
    }

    try {
      const userMeta = await checkOrganizationPermission.getUserMeta(
        auth._id
      );
      const hasPermission = permissions.some((permission) =>
        userMeta.organization?.role?.permissions.includes(permission)
      );

      return { allowed: hasPermission, data: userMeta };
    } catch (error) {
      logger.error(error as string);
      return { allowed: false, data: null };
    }
  };
}

export default checkOrganizationPermission;
