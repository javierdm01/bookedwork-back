/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { VerValoracionesDto } from './dto/verValoraciones.dto';


@Controller('negocios')
export class NegociosController {
  constructor(private readonly negociosService: NegociosService) {}


  @Post('buscarNegocios')
  buscarNegocios(@Body() buscarNegocio: BuscarNegocioDto) {
    return this.negociosService.buscarNegociosPorCriterios(buscarNegocio);
  }

  @Post('getOneNegocio')
  getOneNegocio(@Body() name: object) {
    return this.negociosService.getOneNegocio(name['nombre']);
  }

  @Post('verReservas')
  verReservas(@Body() email: string) {
    return this.negociosService.verReservas({re:email});
  }

  @Post('getNegocios')
  getNegocios(@Body() obj:object){
    return this.negociosService.getNegocios(obj)
  }
  @Post('verValoraciones')
  verValoraciones(@Body() obj:VerValoracionesDto){
    return this.negociosService.verValoraciones(obj)
  }
}
