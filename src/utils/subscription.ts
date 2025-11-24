import type { NewSubscription } from "../models/subscription.js";
import { db } from "../config/db.js";
import { subscriptions } from "../models/subscription.js";
import { eq } from "drizzle-orm";


const saveSubscription = async (endpoint: string, p256dh: string, auth: string) => {
    try {
        const subscription: NewSubscription = { endpoint, p256dh, auth, status: "active" };
        const response = await db.insert(subscriptions).values(subscription).returning({ subId: subscriptions.id });
        const subId = response ? response[0]?.subId : undefined;
        return subId;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error:\n\tname: ${error.name}\n\tmessage: ${error.message}`);
            throw new Error(error.message);
        }
        else throw new Error("Unknow error occurred while inserting subscription!!");
    }
}

const updateSubscription = async (subId: string, updatedSub: { endpoint?: string, p256dh?: string, auth?: string, status?: "active" | "inactive" | "expire" }) => {
    try {
        const response = await db.update(subscriptions)
            .set(updatedSub)
            .where(eq(subscriptions.id, subId));
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error:\n\tname: ${error.name}\n\tmessage: ${error.message}`);
            throw new Error(error.message);
        }
        else throw new Error("Unknow error occurred while updateing subscription status!!");
    }
}

const getSubscriptionById = async (id: string) => {
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
const getAllSubscriptions = async () => {
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
            .where(eq(subscriptions.status, "active"));

        if (!sub) return [];
        return sub;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error:\n\tname: ${error.name}\n\tmessage: ${error.message}`);
            throw new Error(error.message);
        }
        else throw new Error("Unknow error occurred!!");
    }
}

export { saveSubscription, getSubscriptionById, getAllSubscriptions, updateSubscription };