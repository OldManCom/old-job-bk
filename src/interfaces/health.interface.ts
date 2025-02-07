/**
 * 헬스 체크
 */
export interface HealthCheckResponse {
  // 전체 API 상태
  status: string;
  // 연결된 외부 서비스들의 상태 체크
  services: {
    // 데이터베이스 연결 상태 확인
    database: ServiceStatus;
    // Redis 캐시 서버 연결 상태 확인
    redis: ServiceStatus;
    // 외부 API(결제, 인증 등) 연결 상태 확인
    externalApi: ServiceStatus;
  };
  // 시스템 리소스 상태
  system: {
    // 서버 구동 시간 (초 단위)
    uptime: number;
    // 메모리 사용량 (RSS, heap 등 상세 정보 포함)
    memory: NodeJS.MemoryUsage;
  };
}

export interface ServiceStatus {
  status: "ok" | "error";
  message?: string;
  latency?: number;
}
