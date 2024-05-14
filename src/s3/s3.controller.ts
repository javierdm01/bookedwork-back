/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { CreateS3Dto } from './dto/create-s3.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file')) // Interceptor para manejar archivos en la solicitud
  uploadFile(@Body() createS3: CreateS3Dto, @UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.s3Service.uploadFile(createS3.username,createS3.jFunction, file);
  }
}
