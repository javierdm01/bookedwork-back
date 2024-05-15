/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { NegociosController } from './negocios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Negocio } from './entities/negocio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Negocio])],
  controllers: [NegociosController],
  providers: [NegociosService],
})
export class NegociosModule {}
