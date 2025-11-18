import { Router } from "express";
import type { Request, Response } from "express";
import { saveSubscription, getSubscriptionById } from "../utils/subscription.js";
import { sendNotification } from "../utils/helper.js";

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
        console.log(error);
        return res.status(500).json({ message: "some thing went wrong!!" });
    }
});

router.post("/push-notification", async (req: Request, res: Response) => {
    try {
        // const { id } = req.body;
        const subscription = await getSubscriptionById(1);
        const message = {
            body: "Elon Musk sent you a friend request",
            icon: "https://media.npr.org/assets/img/2022/06/01/ap22146727679490-6b4aeaa7fd9c9b23d41bbdf9711ba54ba1e7b3ae-s800-c85.webp",
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
        if(!subscription) throw TypeError();
        await sendNotification(subscription, message);
        res.json({ message: "message sent" });    
    } catch (error) {
        console.error(error);
        res.status(500).json("failed to push notification!!");
    }
});

export default router;