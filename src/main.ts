/* eslint-disable prettier/prettier */
import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as https from 'https';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  axios.defaults.baseURL = 'http://ec2-13-53-129-231.eu-north-1.compute.amazonaws.com:5000';
  axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
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