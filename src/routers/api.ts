import { Router } from "express";
import type { Request, Response } from "express";
import { saveSubscription, getSubscriptionById } from "../utils/subscription.js";
import { sendNotification } from "../utils/helper.js";
import { getMeme } from "../utils/meme.js";
import { isMeme } from "../models/meme.js";

const router = Router();

export interface sub {
    endpoint: string,
    expirationTime?: null,
    keys: { p256dh: string, auth: string }
}

router.post("/subscription", async (req: Request, res: Response) => {
    try {
        const subscription: sub = req.body;
        const { endpoint, keys } = subscription;
        await saveSubscription(endpoint, keys.p256dh, keys.auth);
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "some thing went wrong!!" });
    }
});

router.put("/subscription", async (req: Request, res: Response) => {
    try {
        const subscription: sub = req.body.subscription;
        const { endpoint, keys } = subscription;
        await saveSubscription(endpoint, keys.p256dh, keys.auth);
        return res.status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "some thing went wrong!!" });
    }
});

router.post("/push-notification", async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        const subscription = await getSubscriptionById(id);
        if (!subscription) throw TypeError(`subscription can not be ${typeof (subscription)}!!`);
        const meme = await getMeme();
        if (!isMeme(meme)) throw TypeError(`meme can not be ${typeof (meme)}!!`);
        const message = {
            body: meme.description,
            image: meme.url,
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
                    title: "View Profile",
                },
            ],
            tag: "friend_request",
        };
        await sendNotification(subscription, message);
        res.json({ message: "notification sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json("failed to push notification!!");
    }
});

export default router;