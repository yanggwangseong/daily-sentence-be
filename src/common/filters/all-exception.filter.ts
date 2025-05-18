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

import { winstonLogger } from "../logger/winston";

/**
 * 모든 예외 필터
 * @summary 모든 예외 필터
 * @description 모든 예외 필터
 * @version 1.0.0
 * @author 양광성
 * @since 2025-05-17
 * @todo 정확한 타입을 위한 전체 exception 설계가 필요함
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
        void this.logError(
            this.createFormattedErrorLog(exception, httpStatus),
            httpStatus,
        );
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

    private logError(errorLog: string, statusCode: number) {
        winstonLogger.error(errorLog, { statusCode });
    }

    private createFormattedErrorLog(exception: unknown, statusCode: number) {
        return `[${process.env["NODE_ENV"]}] ${exception} ${statusCode}`;
    }
}
