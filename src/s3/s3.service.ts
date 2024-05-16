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

  async uploadFile(userName:string,jFunction:string,files:Array<Express.Multer.File>): Promise<string[]>{
    let key;
    try{
      switch(jFunction){
          case 'avatar':
              key= `avatar/${userName}-${new Date().toISOString()}`;
              break;
          default:
              key= `negocio/${userName}/${userName}-${new Date().toISOString()}`;
      }
      const results=[]
      await files.forEach(async (file) => {
        const params = {
          Bucket: 'bookedwork-img',
          Key: key,
          Body: Readable.from(file.buffer),
          ContentType: file.mimetype,
        };
      
        const r=(await this.s3.upload(params).promise().then((data) => data.Location))
        results.push(r)
      })
      return results
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}

