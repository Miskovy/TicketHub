import { Router } from "express";
import { getNotifications, markNotificationAsRead, deleteNotification, getUnSeenNotificationsCount } from "../../controllers/admins/notifications";
import { catchAsync } from "../../utils/catchAsync";
import { authenticated } from "../../middlewares/authenticated";

const router = Router();

router.use(authenticated);

router.get("/", catchAsync(getNotifications));
router.get("/unseen/count", catchAsync(getUnSeenNotificationsCount));
router.patch("/:notificationId/read", catchAsync(markNotificationAsRead));
router.delete("/:notificationId", catchAsync(deleteNotification));

export default router;