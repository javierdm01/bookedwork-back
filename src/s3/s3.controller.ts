/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { CreateS3Dto } from './dto/create-s3.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  
  @UseGuards(JwtAuthGuard)
  @Post('uploadFile')
  @UseInterceptors(FilesInterceptor('files')) // Interceptor para manejar archivos en la solicitud
  uploadFile(@Body() createS3: CreateS3Dto, @UploadedFiles() files: Array<Express.Multer.File>): Promise<string[]>{
    return this.s3Service.uploadFile(createS3.username,createS3.jFunction, files);
  }

  @Post('uploadOneFile')
  @UseInterceptors(FileInterceptor('files')) // Interceptor para manejar archivos en la solicitud
  uploadOneFile(@Body() createS3: CreateS3Dto, @UploadedFile() files: Express.Multer.File): Promise<string>{
    return this.s3Service.uploadOneFile(createS3.username,createS3.jFunction, files);
  }

  @Post('deleteFile')
  deleteFile(@Body() url: string) {
    return this.s3Service.deleteFile(url);
  }

}
