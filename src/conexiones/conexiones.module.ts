/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConexionesService } from './conexiones.service';
import { ConexionesController } from './conexiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conexion } from './entities/conexion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conexion]),
  ],
  controllers: [ConexionesController],
  providers: [ConexionesService],
})
export class ConexionesModule {}
