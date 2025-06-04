import { Instant, ZoneId, ZonedDateTime } from "@js-joda/core";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { z } from "zod/v4";

@Injectable()
export class DatePipe implements PipeTransform {
    transform(value: string) {
        const parsedDate = new Date(value);

        const result = z.date().safeParse(parsedDate);

        if (!result.success) {
            throw new BadRequestException("유효하지 않은 날짜 형식입니다.");
        }

        return ZonedDateTime.ofInstant(
            Instant.ofEpochMilli(result.data.getTime()),
            ZoneId.of("Asia/Seoul"),
        )
            .toLocalDate()
            .toString();
    }
}
