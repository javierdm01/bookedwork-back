/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
import { Profesional } from './entities/profesionales.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private profesionaleRepository: Repository<Profesional>,
    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
    @Inject(S3Service)
    private readonly s3Service: S3Service,
  ){}

  crearProfesional(createProfesionaleDto: CreateProfesionaleDto) {
    const profesional = this.profesionaleRepository.find({where: {email: createProfesionaleDto.email}})
    if(profesional) throw new Error('Profesional ya registrado')
    const avatar=this.s3Service.uploadFile(createProfesionaleDto.nombre,'avatar',createProfesionaleDto.avatar)
    return this.profesionaleRepository.save({
      ...createProfesionaleDto,
      avatar:avatar[0]
    });
  }
  async verReservas(email: string) : Promise<Reserva[]>{
    const profesional=await this.profesionaleRepository.findOne({where: {email}})
    if(!profesional) throw new Error('Profesional no encontrado')
    return this.reservasRepository.find({where: {profesional}})
  }



}
 