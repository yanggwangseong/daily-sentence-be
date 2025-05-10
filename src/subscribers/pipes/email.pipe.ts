import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class EmailPipe implements PipeTransform {
    transform(value: string) {
        if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            throw new BadRequestException("이메일 형식이 올바르지 않습니다.");
        }

        if (value.length > 100) {
            throw new BadRequestException("이메일은 100자 이하여야 합니다.");
        }

        return value;
    }
}
