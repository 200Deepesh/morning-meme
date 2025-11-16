import { Router } from "express";
import type { Request, Response } from "express";
import { saveSubscription } from "../utils/subscription.js";

const router = Router();

interface sub {
    endpoint: string,
    expirationTime: null,
    keys: { p256dh: string, auth: string }
}

router.post("/subscription", async (req: Request, res: Response) => {
    try {
        const subscription: sub = req.body;
        const { endpoint, keys } = subscription;
        await saveSubscription(endpoint, keys.p256dh, keys.auth);
        return res.status(200);
    } catch (error) {
        
    }
});

export default router;