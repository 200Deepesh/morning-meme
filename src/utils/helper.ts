import webpush from "web-push";
import type { sub } from "../routers/api.js";
import { getAllSubscriptions } from "./subscription.js";
import { getMeme } from "./meme.js";
import { isMeme } from "../models/meme.js";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;

webpush.setVapidDetails(
    "mailto:deepeshgupta8843@gmail.com",
    VAPID_PUBLIC_KEY || "",
    VAPID_PRIVATE_KEY || ""
);

const sendNotification = async (subscription: sub, message: any) => {
    try {
        const data = JSON.stringify(message);
        const status = await webpush.sendNotification(subscription, data);
    } catch (error) {
        console.error(error);
        throw new Error("fail to push notification!!");
    }
}

const pushMemeNotificationToAll = async () => {
    try {
        const subscriptions = await getAllSubscriptions();
        if (!subscriptions) throw TypeError(`subscriptions can not be ${typeof (subscriptions)}!!`);
        const meme = await getMeme();
        if (!isMeme(meme)) throw TypeError(`meme can not be ${typeof (meme)}!!`);
        const message = {
            body: meme.description || "Elon Musk sent you a friend request",
            image: meme.url || "http://localhost:3000/assets/elonmusk.jpg",
            data: {
                requestId: "1234",
                username: "elonmusk"
            },
            actions: [
                {
                    action: "accept",
                    title: "Accept",
                },
                {
                    action: "view",
                    title: "View",
                },
            ],
            tag: "friend_request",
        };
        subscriptions.map(async (subscription) => {
            try {
                await sendNotification(subscription, message);
            } catch (error) {
                console.error(`failed to push notification to ${subscription.endpoint}`);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export { sendNotification, pushMemeNotificationToAll };