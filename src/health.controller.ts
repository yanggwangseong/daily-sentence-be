import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
    constructor() {}

    @Get()
    health(): string {
        return "OK";
    }
}
