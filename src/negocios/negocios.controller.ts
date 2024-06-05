/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';


@Controller('negocios')
export class NegociosController {
  constructor(private readonly negociosService: NegociosService) {}


  @Post('buscarNegocios')
  buscarNegocios(@Body() buscarNegocio: BuscarNegocioDto) {
    return this.negociosService.buscarNegociosPorCriterios(buscarNegocio);
  }

  @Post('verReservas')
  verReservas(@Body() email: string) {
    return this.negociosService.verReservas({re:email});
  }

}
