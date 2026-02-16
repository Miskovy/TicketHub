import { AuthenticatedRequest } from "../../types/custom";
import { Response } from "express";
import { db } from "../../models/db";
import { notifications } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { BadRequest } from "../../Errors/BadRequest";

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id || 0;
    if (!adminId) {
        return SuccessResponse(res, { AllNotifications: [], unReadNotifications: [] }, 200);
    }

    try {
        const AllNotifications = await db.select().from(notifications).where(eq(notifications.adminId, adminId));
        const unReadNotifications = AllNotifications.filter((notification) => !notification.isRead);
        return SuccessResponse(res, { AllNotifications, unReadNotifications }, 200);
    } catch (error) {
        console.error("Error getting notifications:", error);
        throw new BadRequest(error instanceof Error ? error.message : "Failed to get notifications");
    }
};

export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || 0;
    const notificationId = parseInt(req.params.notificationId);
    if (!userId || !notificationId) {
        throw new BadRequest("Invalid request");
    }

    try {
        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
        return SuccessResponse(res, { message: "Notification marked as read" }, 200);
    } catch (error) {
        console.error("Error getting notifications:", error);
        throw new BadRequest(error instanceof Error ? error.message : "Failed to get notifications");
    }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || 0;
    const notificationId = parseInt(req.params.notificationId);
    if (!userId || !notificationId) {
        throw new BadRequest("Invalid request");
    }

    try {
        await db.delete(notifications).where(eq(notifications.id, notificationId));
        return SuccessResponse(res, { message: "Notification deleted successfully" }, 200);
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw new BadRequest(error instanceof Error ? error.message : "Failed to delete notification");
    }
};