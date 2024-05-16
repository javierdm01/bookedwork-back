/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ReservasService } from './reservas.service';
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  /*@Post('realizarReserva')
  realizarReserva(@Body() realizarReserva: RealizarReservaDto) {
    return this.reservasService.realizarReserva(realizarReserva);
  }*/
  
}
