import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class SuccessResponseDto<T> {
    @ApiProperty({ type: Boolean, description: "성공여부" })
    @Expose()
    success!: boolean;

    @ApiProperty({
        description: "object 또는 array 형식의 응답데이타가 옵니다.",
    })
    @Expose()
    data!: T;
}
