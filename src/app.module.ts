import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [UsersModule, MinioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
