"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnSeenNotificationsCount = exports.deleteNotification = exports.markNotificationAsRead = exports.getNotifications = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const BadRequest_1 = require("../../Errors/BadRequest");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
    if (!adminId) {
        return (0, response_1.SuccessResponse)(res, { AllNotifications: [], unReadNotifications: [] }, 200);
    }
    try {
        const AllNotifications = yield db_1.db
            .select()
            .from(schema_1.notifications)
            .where((0, drizzle_orm_1.eq)(schema_1.notifications.adminId, adminId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt));
        const unSeenNotificationsCount = AllNotifications.filter((notification) => !notification.isSeen).length;
        // Mark all fetched notifications as seen
        if (AllNotifications.length > 0) {
            yield db_1.db
                .update(schema_1.notifications)
                .set({ isSeen: true })
                .where((0, drizzle_orm_1.eq)(schema_1.notifications.adminId, adminId));
        }
        return (0, response_1.SuccessResponse)(res, { AllNotifications, unSeenNotificationsCount }, 200);
    }
    catch (error) {
        console.error("Error getting notifications:", error);
        throw new BadRequest_1.BadRequest(error instanceof Error ? error.message : "Failed to get notifications");
    }
});
exports.getNotifications = getNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
    const notificationId = parseInt(req.params.notificationId);
    if (!userId || !notificationId) {
        throw new BadRequest_1.BadRequest("Invalid request");
    }
    try {
        yield db_1.db.update(schema_1.notifications).set({ isRead: true }).where((0, drizzle_orm_1.eq)(schema_1.notifications.id, notificationId));
        return (0, response_1.SuccessResponse)(res, { message: "Notification marked as read" }, 200);
    }
    catch (error) {
        console.error("Error getting notifications:", error);
        throw new BadRequest_1.BadRequest(error instanceof Error ? error.message : "Failed to get notifications");
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
    const notificationId = parseInt(req.params.notificationId);
    if (!userId || !notificationId) {
        throw new BadRequest_1.BadRequest("Invalid request");
    }
    try {
        yield db_1.db.delete(schema_1.notifications).where((0, drizzle_orm_1.eq)(schema_1.notifications.id, notificationId));
        return (0, response_1.SuccessResponse)(res, { message: "Notification deleted successfully" }, 200);
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        throw new BadRequest_1.BadRequest(error instanceof Error ? error.message : "Failed to delete notification");
    }
});
exports.deleteNotification = deleteNotification;
const getUnSeenNotificationsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
    if (!adminId) {
        return (0, response_1.SuccessResponse)(res, { unSeenNotificationsCount: 0 }, 200);
    }
    try {
        const [result] = yield db_1.db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.notifications)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.adminId, adminId), (0, drizzle_orm_1.eq)(schema_1.notifications.isSeen, false)));
        return (0, response_1.SuccessResponse)(res, { unSeenNotificationsCount: result.count }, 200);
    }
    catch (error) {
        console.error("Error getting unSeenNotificationsCount:", error);
        throw new BadRequest_1.BadRequest(error instanceof Error ? error.message : "Failed to get unSeenNotificationsCount");
    }
});
exports.getUnSeenNotificationsCount = getUnSeenNotificationsCount;
