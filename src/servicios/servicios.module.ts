/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { Servicio } from './entities/servicio.entity';
import { Profesional } from 'src/profesionales/entities/profesionales.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from 'src/negocios/entities/negocio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio, Profesional, Negocio])],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {}
