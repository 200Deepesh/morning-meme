import type { NewSubscription } from "../models/subscription.js";
import { db } from "../config/db.js";
import { subscriptions } from "../models/subscription.js";


const saveSubscription = async (endpoint: string, p256dh: string, auth: string) => {
    try {
        const subscription: NewSubscription = { endpoint, p256dh, auth };
        await db.insert(subscriptions).values(subscription);
    } catch (error) {
        if(error instanceof Error){
            console.error(`Error:\n\tname: ${error.name}\n\tmessage: ${error.message}`);
            throw new Error(error.message);
        }
        else throw new Error("Unknow error occurred!!");
    }
}

export { saveSubscription };