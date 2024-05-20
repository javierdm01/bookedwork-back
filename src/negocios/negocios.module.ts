/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { NegociosController } from './negocios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from './entities/negocio.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Negocio,Reserva,Servicio])],
  controllers: [NegociosController],
  providers: [NegociosService],
})
export class NegociosModule {}
