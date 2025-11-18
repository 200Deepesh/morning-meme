import webpush from "web-push";
import type { sub } from "../routers/api.js";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;

webpush.setVapidDetails(
    "mailto:deepeshgupta8843@gmail.com",
    VAPID_PUBLIC_KEY || "",
    VAPID_PRIVATE_KEY || ""
);

const sendNotification = async (subscription: sub, message: any) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(message));
    } catch (error) {
        console.error(error);
        throw new Error("fail to push notification!!");
    }
}

export { sendNotification };