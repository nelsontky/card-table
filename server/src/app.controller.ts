import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { AppService } from "./app.service";

import { AuthGuard } from "./common/auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/auth")
  @UseGuards(AuthGuard)
  getAuth(@Req() request): string {
    return "Auth route";
  }
}
