import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { z } from "zod/v4";

import { toKoreanLocalDateString } from "../../common/utils/date.util";

@Injectable()
export class DatePipe implements PipeTransform {
    transform(value: string) {
        const parsedDate = new Date(value);

        const result = z.date().safeParse(parsedDate);

        if (!result.success) {
            throw new BadRequestException("유효하지 않은 날짜 형식입니다.");
        }

        return toKoreanLocalDateString(result.data);
    }
}
