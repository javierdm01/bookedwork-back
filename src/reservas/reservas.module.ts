/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './entities/reserva.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Negocio } from 'src/negocios/entities/negocio.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Profesional } from 'src/profesionales/entities/profesionales.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva,Negocio,Cliente,Profesional])],
  controllers: [ReservasController],
  providers: [ReservasService,EmailService],
})
export class ReservasModule {}
