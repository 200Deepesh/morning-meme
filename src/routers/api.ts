import { Router } from "express";
import type { Request, Response } from "express";
import { saveSubscription, getSubscriptionById, updateSubscription } from "../utils/subscription.js";
import { sendNotification } from "../utils/helper.js";
import { getMeme } from "../utils/meme.js";
import { isMeme } from "../models/meme.js";

const router = Router();

export interface sub {
    endpoint: string,
    expirationTime?: null,
    keys: { p256dh: string, auth: string },
}

router.post("/subscription", async (req: Request, res: Response) => {
    try {
        const subscription: sub = req.body;
        const { endpoint, keys } = subscription;
        const subId = await saveSubscription(endpoint, keys.p256dh, keys.auth);
        res.cookie("subId", subId, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.cookie("status", "active", { maxAge: 365 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ subId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "some thing went wrong!!" });
    }
});

router.put("/subscription", async (req: Request, res: Response) => {
    console.log("----")
    try {
        const subId = req.cookies.subId;
        if (!subId) return res.status(400).json({error: "Subscription id is missing!!"});
        if (req.body.status) {
            const status: "active" | "inactive" | "expire" = req.body.status;
            await updateSubscription(subId, { status });
            res.cookie("status", status);
            return res.status(200).json({message: "Update status successfully!!"});
        }
        if (req.body.subscription) {
            const subscription: sub = req.body.subscription;
            await updateSubscription(subId, subscription);
            res.cookie("status", "active");
            return res.status(200).json({message: "Update subscription successfully!!"});
        }
        return res.status(400).json({error: "Status / Subscription required!!"});
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
            icon: "http://localhost:3000/assets/elonmusk.jpg",
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