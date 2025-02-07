import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { HealthCheckResponse } from "./interfaces/health.interface";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
  async healthCheck(): Promise<HealthCheckResponse> {
    return await this.appService.getHealthStatus();
  }

  @Get("/info")
  getApiInfo() {
    return this.appService.getApiInfo();
  }
}
