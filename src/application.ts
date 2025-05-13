import { INestApplication, NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import path from "path";

import { AppModule } from "@APP/app.module";

import { ENV_SERVER_PORT } from "./common/constants/env-keys.const";

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env["NODE_ENV"] === "production"
            ? ".production.env"
            : process.env["NODE_ENV"] === "stage"
              ? ".stage.env"
              : ".development.env",
    ),
});

export namespace Backend {
    export const start = async (options: NestApplicationOptions = {}) => {
        const app = await NestFactory.create(AppModule, options);

        await app.listen(process.env[ENV_SERVER_PORT]!);

        process.on("SIGINT", async () => {
            await end(app);
            process.exit(0);
        });

        return app;
    };

    export const end = async (app: INestApplication) => {
        await app.close();
    };
}
