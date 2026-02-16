import { db } from "../models/db";
import { notifications, admins } from "../models/schema";
import { eq } from "drizzle-orm";
import { getIO } from "../socket";

export const notifyAdmins = async (title: string, message: string) => {
    try {
        const io = getIO();

        const superAdmins = await db
            .select({ id: admins.id })
            .from(admins)
            .where(eq(admins.isSuperAdmin, true));

        if (superAdmins.length === 0) return;

        const notificationRecords = superAdmins.map(admin => ({
            adminId: admin.id,
            title,
            message,
            isRead: false,
            createdAt: new Date()
        }));

        await db.insert(notifications).values(notificationRecords);

        io.to("super_admins").emit("new_notification", {
            title,
            message,
            createdAt: new Date()
        });

    } catch (error) {
        console.error("Failed to notify admins:", error);
    }
};
