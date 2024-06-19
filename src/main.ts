/* eslint-disable prettier/prettier */
import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/ssl/nestjs/cert.key'),
    cert: fs.readFileSync('/etc/ssl/nestjs/cert.crt'),
  };
  const app = await NestFactory.create(AppModule,{cors:true,httpsOptions});
  
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('ISO 27001 EXAMPLE')
    .setDescription('This is a simple example of ISO 27001 API')
    .setVersion('1.0')
    .addTag('ISO27001')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);

}
bootstrap();