/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateConexioneDto } from './dto/create-conexione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conexion } from './entities/conexion.entity';

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private conexionesRepository: Repository<Conexion>,
  ) {}

  async createNewConexiones(createConexioneDto: CreateConexioneDto) {
    const newConexiones = this.conexionesRepository.create({
      ...createConexioneDto,
      fecha_inicio: new Date(),
    });
    return this.conexionesRepository.save(newConexiones);
  }
}
