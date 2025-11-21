import { type NewMeme, type Meme, memes, isMeme } from "../models/meme.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";

const humor_api_key = String(process.env.HUMOR_API_KEY);

async function setMeme(): Promise<boolean> {
    const url = `https://api.humorapi.com/memes/random?api-key=${humor_api_key}`;
    let res = await fetch(url);
    let meme = await res.json();
    if (isMeme(meme)) {
        meme.memeId = meme.id;
        meme.id = 1;
        const oldMeme = await getMeme();
        if(oldMeme){
            await db.update(memes).set(meme).where(eq(memes.id, 1));
        } else {
            await db.insert(memes).values(meme);
        }
        return true;
    }
    return false;
}

async function getMeme(): Promise<Meme | undefined> {
    const meme = await db.select().from(memes).where(eq(memes.id, 1));
    return meme[0];
}
export { setMeme, getMeme };