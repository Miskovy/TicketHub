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
exports.notifyAdmins = void 0;
const db_1 = require("../models/db");
const schema_1 = require("../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const socket_1 = require("../socket");
const notifyAdmins = (title, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = (0, socket_1.getIO)();
        const superAdmins = yield db_1.db
            .select({ id: schema_1.admins.id })
            .from(schema_1.admins)
            .where((0, drizzle_orm_1.eq)(schema_1.admins.isSuperAdmin, true));
        if (superAdmins.length === 0)
            return;
        const notificationRecords = superAdmins.map(admin => ({
            adminId: admin.id,
            title,
            message,
            isRead: false,
            createdAt: new Date()
        }));
        yield db_1.db.insert(schema_1.notifications).values(notificationRecords);
        io.to("super_admins").emit("new_notification", {
            title,
            message,
            createdAt: new Date()
        });
    }
    catch (error) {
        console.error("Failed to notify admins:", error);
    }
});
exports.notifyAdmins = notifyAdmins;
