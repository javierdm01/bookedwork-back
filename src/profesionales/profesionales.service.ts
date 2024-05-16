/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
import { Profesional } from './entities/profesionales.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private profesionaleRepository: Repository<Profesional>,
  ){}
  crearProfesional(createProfesionaleDto: CreateProfesionaleDto) {
    const profesional = this.profesionaleRepository.create(createProfesionaleDto);
    return this.profesionaleRepository.save(profesional);
  }

}
 