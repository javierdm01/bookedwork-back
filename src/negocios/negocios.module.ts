import { Module } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { NegociosController } from './negocios.controller';

@Module({
  controllers: [NegociosController],
  providers: [NegociosService],
})
export class NegociosModule {}
