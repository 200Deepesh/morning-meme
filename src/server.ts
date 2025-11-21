import express from "express";
import type { Request, Response } from "express";
import { config } from "./config/app.js";
import apiRouter from "./routers/api.js";
import cron from "node-cron";
import { getMeme, setMeme } from "./utils/meme.js";
import { pushMemeNotificationToAll } from "./utils/helper.js";

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

app.use("/api", apiRouter);

app.get('/', async (req: Request, res: Response) => {
    const meme = await getMeme();
    if (meme) {
        return res.render("index", { meme });
    }
    return res.render("index");
});


app.listen(config.port, () => console.log(`Server is listening to PORT: ${config.port}`));

cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');
  const isSet = await setMeme();
  if(isSet){
      await pushMemeNotificationToAll();
  } else {
    console.error(`setMeme return false!!`);
  }
});