/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,

    @Inject(S3Service)
    private readonly s3Service: S3Service,
  ){}


  
}
