interface Config {
    port: number;
    nodeEnv: String;
}

const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || "development",
};

export { config };