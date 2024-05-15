/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';


@Controller('negocios')
export class NegociosController {
  constructor(private readonly negociosService: NegociosService) {}


  //Para hacer la petición necesitas estar autenticado
  @UseGuards(JwtAuthGuard)
  @Post('buscarNegocios')
  buscarNegocios(@Body() buscarNegocio: BuscarNegocioDto) {
    return this.negociosService.buscarNegocios(buscarNegocio);
  }

}
