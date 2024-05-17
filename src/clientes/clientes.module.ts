/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { S3Service } from 'src/s3/s3.service';
import { Reserva } from 'src/reservas/entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente,Reserva])],
  controllers: [ClientesController],
  providers: [ClientesService,S3Service],
  exports: [ClientesService]
})
export class ClientesModule {}
