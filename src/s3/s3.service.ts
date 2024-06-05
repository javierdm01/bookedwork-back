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
    const date=new Date().toISOString()
    try{
      switch(jFunction){
          case 'avatar':
              key= `avatar/${userName}-${date.replaceAll(':','')}`;
              break;
          default:
              key= `negocio/${userName}/${userName}-${date.replaceAll(':','')}`;
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
  async uploadOneFile(userName:string,jFunction:string,files:Express.Multer.File): Promise<string>{
    let key;
    const date=new Date().toISOString()
    try{
      switch(jFunction){
          case 'avatar':
              key= `avatar/${userName}-${date.replaceAll(':','')}`;
              break;
          default:
              key= `negocio/${userName}/${userName}-${date.replaceAll(':','')}`;
      }
      const results=[]
        const params = {
          Bucket: 'bookedwork-img',
          Key: key,
          Body: Readable.from(files.buffer),
          ContentType: files.mimetype,
        }
        const r=(await this.s3.upload(params).promise().then((data) => data.Location))
        console.log(r)
        results.push(r)
        return results.toString()
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
  
  async deleteFile(url: string) {
    const params = {
      Bucket: 'bookedwork-img',
      Key: JSON.stringify(url).split('.com/')[1],
    };
    try {
      return await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }
}
