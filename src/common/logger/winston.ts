import { WinstonModule, utilities } from "nest-winston";
import winston from "winston";

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env["NODE_ENV"] === "production" ? "http" : "debug",
            format: winston.format.combine(
                winston.format.timestamp(),
                utilities.format.nestLike(process.env["NODE_ENV"], {
                    colors: true,
                    prettyPrint: true,
                }),
            ),
        }),
    ],
});
