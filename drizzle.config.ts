import type {Config} from "drizzle-kit";

export default {
    "schema": "./src/models",
    "dialect": "sqlite",
    "dbCredentials": {
        "url": process.env.DATABASE || "dev.db"
    }
} satisfies Config;