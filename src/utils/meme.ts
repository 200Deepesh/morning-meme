import type { NewMeme } from "../models/meme.js";
import { httpRequest } from "./fetcher.js";

const humor_api_key = String(process.env.HUMOR_API_KEY);

async function getRandomMeme(): Promise<NewMeme | undefined> {
    try {
        const url = 'https://api.humorapi.com/memes/random';
        const config = {
            queryParams: {
                "api-key": humor_api_key,
            }
        }
        const { data: meme, error } = await httpRequest<NewMeme, null>(url, config);
        if(error){
            // todo
            return;
        }
        return meme;
    } catch (error) {
        
    }
}

export { getRandomMeme };