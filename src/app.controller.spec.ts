import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe("health", () => {
    it("should return health status", async () => {
      const result = await appController.healthCheck();
      expect(result).toHaveProperty("status", "ok");
      expect(result).toHaveProperty("services");
      expect(result).toHaveProperty("system");
    });

    it("should include system information", async () => {
      const result = await appController.healthCheck();
      expect(result.system).toHaveProperty("uptime");
      expect(result.system).toHaveProperty("memory");
    });
  });

  describe("info", () => {
    it("should return API information", () => {
      const result = appController.getApiInfo();
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("version");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("endpoints");
    });
  });
});
