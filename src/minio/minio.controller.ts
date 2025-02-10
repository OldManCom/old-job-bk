import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { FileResponseDto } from './dto/file-response.dto';
import { BufferedFile } from './models/file.model';

@Controller('files')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 현재 : 5MB
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: BufferedFile,
    @Query('basePath') basePath?: string,
  ): Promise<FileResponseDto> {
    // 업로드 시의 파일 경로 및 파일이름
    const filename = await this.minioService.upload(file, basePath);
    const url = await this.minioService.getFileUrl(filename);
    return { filename, url };
  }

  @Get(':filename')
  async getFile(
    @Param('filename') filename: string,
    @Query('basePath') basePath?: string,
  ): Promise<FileResponseDto> {
    const fullPath = basePath ? `${basePath}/${filename}` : filename;
    const url = await this.minioService.getFileUrl(fullPath);
    return { filename: fullPath, url };
  }

  @Delete(':filename')
  async deleteFile(
    @Param('filename') filename: string,
    @Query('basePath') basePath?: string,
  ): Promise<FileResponseDto> {
    const fullPath = basePath ? `${basePath}/${filename}` : filename;
    await this.minioService.delete(fullPath);
    return { filename: fullPath, message: 'File deleted successfully' };
  }
}
