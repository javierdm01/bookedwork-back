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

  async uploadFile(userName: string, jFunction: string, files: Array<Express.Multer.File>): Promise<string[]> {
    const date = new Date().toISOString().replace(/[:.]/g, '');
    const results = [];

    // Define the base path based on jFunction
    let basePath = '';
    switch (jFunction) {
        case 'avatar':
            basePath = `avatar/${userName}/`;
            break;
        default:
            basePath = `negocio/${userName}/`;
    }

    // Remove any spaces or special characters from the base path
    basePath = basePath.replace(/[^a-zA-Z0-9/_-]/g, '');

    // Check if the base path (folder) exists
    const listParams = {
        Bucket: 'bookedwork-img',
        Prefix: basePath
    };

    try {
        const listData = await this.s3.listObjectsV2(listParams).promise();

        // If the folder does not exist, create it
        if (listData.KeyCount === 0) {
            const folderParams = {
                Bucket: 'bookedwork-img',
                Key: basePath
            };
            await this.s3.putObject(folderParams).promise();
        }

        // Process and upload each file
        for (const [index, file] of files.entries()) {
            const extension = file.originalname.split('.').pop();
            const safeFileName = `${userName}-${date}-${index}`.replace(/[^a-zA-Z0-9_-]/g, '');
            const key = `${basePath}${safeFileName}.${extension}`;

            const params = {
                Bucket: 'bookedwork-img',
                Key: key,
                Body: Readable.from(file.buffer),
                ContentType: file.mimetype,
            };

            const data = await this.s3.upload(params).promise();
            results.push(data.Location);
        }

        return results;
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
    }
}


async uploadOneFile(userName: string, jFunction: string, file: Express.Multer.File): Promise<string> {
  let key;
  const date = new Date().toISOString().replace(/[:.]/g, '');

  try {
      // Definir la clave basada en jFunction y eliminar caracteres no deseados
      switch (jFunction) {
          case 'avatar':
              key = `avatar/${userName}-${date}`;
              break;
          default:
              key = `negocio/${userName}/${userName}-${date}`;
      }

      // Eliminar caracteres especiales de la clave
      key = key.replace(/[^a-zA-Z0-9/_-]/g, '');

      const params = {
          Bucket: 'bookedwork-img',
          Key: key,
          Body: Readable.from(file.buffer),
          ContentType: file.mimetype,
      };

      const data = await this.s3.upload(params).promise();
      const result = data.Location;

      console.log(result);
      return result;
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
