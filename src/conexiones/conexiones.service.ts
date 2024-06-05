/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateConexioneDto } from './dto/create-conexione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conexion } from './entities/conexion.entity';
import { addDays } from 'date-fns';

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private conexionesRepository: Repository<Conexion>,
  ) {}

  async createNewConexiones(createConexioneDto: CreateConexioneDto) {
    /*if(createConexioneDto.cliente){
      const {ip, cliente}= createConexioneDto;
      const preRows= await this.conexionesRepository.find({
        where: {cliente},
        order: {fecha_inicio: 'DESC'},
        take: 5,
      });
      const lastFive= preRows.map((row)=>{
        if(row.ip==ip) return row;
      });
      if(lastFive.length==0)return false
    };*/
    const newConexiones = this.conexionesRepository.create({
      ...createConexioneDto,
      fecha_inicio: new Date(),
      fechaExpiracion: addDays(new Date(),5)
    });
    return this.conexionesRepository.save(newConexiones);
  }
}
