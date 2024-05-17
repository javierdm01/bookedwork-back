/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { ProfesionalesController } from './profesionales.controller';
import { Profesional } from './entities/profesionales.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profesional,Reserva])],
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService,S3Service],
})
export class ProfesionalesModule {}
