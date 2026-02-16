import { AuthenticatedRequest } from "../../types/custom";
import { Response } from "express";
import { db } from "../../models/db";
import { notifications } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq, desc, and, count } from "drizzle-orm";
import { BadRequest } from "../../Errors/BadRequest";

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id || 0;
    if (!adminId) {
        return SuccessResponse(res, { AllNotifications: [], unReadNotifications: [] }, 200);
    }

    try {
        const AllNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.adminId, adminId))
            .orderBy(desc(notifications.createdAt));

        const unSeenNotificationsCount = AllNotifications.filter(
            (notification) => !notification.isSeen
        ).length;

        // Mark all fetched notifications as seen
        if (AllNotifications.length > 0) {
            await db
                .update(notifications)
                .set({ isSeen: true })
                .where(eq(notifications.adminId, adminId));
        }

        return SuccessResponse(
            res,
            { AllNotifications, unSeenNotificationsCount },
            200
        );
    } catch (error) {
        console.error("Error getting notifications:", error);
        throw new BadRequest(
            error instanceof Error ? error.message : "Failed to get notifications"
        );
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

export const getUnSeenNotificationsCount = async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id || 0;
    if (!adminId) {
        return SuccessResponse(res, { unSeenNotificationsCount: 0 }, 200);
    }

    try {
        const [result] = await db
            .select({ count: count() })
            .from(notifications)
            .where(
                and(
                    eq(notifications.adminId, adminId),
                    eq(notifications.isSeen, false)
                )
            );

        return SuccessResponse(res, { unSeenNotificationsCount: result.count }, 200);
    } catch (error) {
        console.error("Error getting unSeenNotificationsCount:", error);
        throw new BadRequest(error instanceof Error ? error.message : "Failed to get unSeenNotificationsCount");
    }
};