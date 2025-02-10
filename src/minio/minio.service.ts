import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { BufferedFile } from './models/file.model';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    console.log('Current ENV:', process.env.NODE_ENV);
    console.log('MinIO Config:', {
      endpoint: this.configService.get('MINIO_ENDPOINT'),
      port: this.configService.get('MINIO_PORT'),
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      bucketName: this.configService.get('MINIO_BUCKET_NAME'),
    });
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'default-bucket';

    this.minioClient = new Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get<string>('MINIO_PORT') || '9000', 10),
      useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    });
  }

  async onModuleInit() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Bucket '${this.bucketName}' created successfully`);
      }
    } catch (error) {
      this.logger.error(`Failed to initialize MinIO bucket: ${error.message}`);
      throw error;
    }
  }

  async upload(file: BufferedFile, basePath: string = ''): Promise<string> {
    try {
      const timestamp = Date.now();
      // basePath 처리 로직 추가
      const sanitizedBasePath = basePath ? basePath.replace(/\/*$/, '') + '/' : '';
      const filename = `${sanitizedBasePath}${timestamp}-${file.originalname}`;

      this.logger.log(`Uploading file with path: ${filename}`);

      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return filename;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async getFileUrl(filename: string): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        filename,
        24 * 60 * 60, // 링크 유효기간 : 24H
      );
    } catch (error) {
      this.logger.error(`Failed to get file URL: ${error.message}`);
      throw error;
    }
  }

  async delete(filename: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, filename);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }
}
