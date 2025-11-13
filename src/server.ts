import express from "express";
import type { Request, Response } from "express";
import { config } from "./config/app.js";

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
    return res.render("index");
});

app.listen(config.port, () => console.log(`Server is listening to PORT: ${config.port}`));