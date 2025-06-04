import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { z } from "zod/v4";

@Injectable()
export class EmailPipe implements PipeTransform {
    transform(value: string) {
        const result = z.email().safeParse(value);

        if (!result.success) {
            throw new BadRequestException("이메일 형식이 올바르지 않습니다.");
        }

        if (value.length > 100) {
            throw new BadRequestException("이메일은 100자 이하여야 합니다.");
        }

        return value;
    }
}
