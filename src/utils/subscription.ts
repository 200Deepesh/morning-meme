import type { NewSubscription } from "../models/subscription.js";
import { db } from "../config/db.js";
import { subscriptions } from "../models/subscription.js";
import { eq } from "drizzle-orm";


const saveSubscription = async (endpoint: string, p256dh: string, auth: string) => {
    try {
        const subscription: NewSubscription = { endpoint, p256dh, auth };
        await db.insert(subscriptions).values(subscription);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error:\n\tname: ${error.name}\n\tmessage: ${error.message}`);
            throw new Error(error.message);
        }
        else throw new Error("Unknow error occurred!!");
    }
}

const getSubscriptionById = async (id: number) => {
    try {
        const sub = await db
            .select({
                endpoint: subscriptions.endpoint,
                keys: {
                    p256dh: subscriptions.p256dh,
                    auth: subscriptions.auth,
                },
            })
            .from(subscriptions)
            .where(eq(subscriptions.id, id))
            .limit(1);

        if (!sub) throw new Error("subscription id dose not exist!!");
        return sub[0];
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error:\n\tname: ${error.name}\n\tmessage: ${error.message}`);
            throw new Error(error.message);
        }
        else throw new Error("Unknow error occurred!!");
    }
}

export { saveSubscription, getSubscriptionById };