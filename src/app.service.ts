import { Injectable } from "@nestjs/common";
import {
  HealthCheckResponse,
  ServiceStatus,
} from "./interfaces/health.interface";

@Injectable()
export class AppService {
  async getHealthStatus(): Promise<HealthCheckResponse> {
    return {
      status: "ok",
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedisConnection(),
        externalApi: await this.checkExternalApi(),
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    };
  }

  private async checkDatabase(): Promise<ServiceStatus> {
    try {
      // 데이터베이스 연결 체크 로직
      return { status: "ok", latency: 20 };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  private async checkRedisConnection(): Promise<ServiceStatus> {
    try {
      // Redis 연결 체크 로직
      return { status: "ok", latency: 5 };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  private async checkExternalApi(): Promise<ServiceStatus> {
    try {
      // 외부 API 체크 로직
      return { status: "ok", latency: 100 };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  getApiInfo() {
    return {
      name: "My NestJS API",
      version: "1.0.0",
      description: "API Description",
      endpoints: {
        health: "/health - 서버 상태 확인",
        users: "/users - 사용자 관리",
      },
    };
  }
}
