/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(jFunction:string,file:Express.Multer.File): Promise<string>{

    let key;
    try{
      switch(jFunction){
          case 'avatar':
              key= `avatar/${file.originalname}`;
              break;
          default:
              key= `negocio/${jFunction}/${file.originalname}`;
      }
      const params = {
        Bucket: 'bookedwork-img',
        Key: key,
        Body: Readable.from(file.buffer),
        ContentType: file.mimetype,
      };

    
      const result = await this.s3.upload(params).promise();
      return result.Location; // Devuelve la URL del archivo en S3
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}

