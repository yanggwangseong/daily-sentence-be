import { INestApplication, NestApplicationOptions } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { IncomingWebhook } from "@slack/webhook";
import dotenv from "dotenv";
import path from "path";

import { AppModule } from "@APP/app.module";

import {
    ENV_SERVER_PORT,
    ENV_SLACK_URL,
} from "./common/constants/env-keys.const";
import { AllExceptionFilter } from "./common/filters/all-exception.filter";
import { SuccessResponseInterceptor } from "./common/interceptors/success-response.interceptor";

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

        // swagger
        const config = new DocumentBuilder()
            .setTitle("daily-sentence API")
            .setDescription("daily-sentence API 문서")
            .setVersion("1.0.0")
            .addBearerAuth(
                {
                    type: "http",
                    scheme: "bearer",
                    name: "JWT",
                    in: "header",
                },
                "accessToken",
            )
            .build();
        SwaggerModule.setup(
            "swagger",
            app,
            SwaggerModule.createDocument(app, config),
        );
        await app
            .useGlobalFilters(
                new AllExceptionFilter(
                    app.get(HttpAdapterHost),
                    new IncomingWebhook(process.env[ENV_SLACK_URL]!),
                ),
            ) // Global Filter 설정
            .useGlobalInterceptors(new SuccessResponseInterceptor()) // Global Interceptor 설정
            .listen(process.env[ENV_SERVER_PORT]!);

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
