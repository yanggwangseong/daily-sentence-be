import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { SentryExceptionCaptured } from "@sentry/nestjs";
import { IncomingWebhook } from "@slack/webhook";

/**
 * 모든 예외 필터
 * @summary 모든 예외 필터
 * @description 모든 예외 필터
 * @version 1.0.0
 * @author 양광성
 * @since 2025-05-17
 * @reference https://docs.nestjs.com/exception-filters#exception-filters
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly incomingWebhook: IncomingWebhook,
    ) {}
    @SentryExceptionCaptured()
    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        void this.incomingWebhook.send({
            text: `[${process.env["NODE_ENV"]}] ${exception}`,
        });

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
