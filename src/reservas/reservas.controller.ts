/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { DisponibilidadReservaDto } from './dto/disponibilidad-reserva.dto';
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post('realizarReserva')
  crearReserva(@Body() realizarReserva: CreateReservaDto) {
    return this.reservasService.crearReserva(realizarReserva);
  }

  @Post('modificarEstado')
  modificarEstado(@Body() id: number) {
    return this.reservasService.modificarEstado(id);
  }

  @Post('comprobarDisponibilidad')
  comprobarDisponibilidad(@Body() comprobarDisponibilidad: DisponibilidadReservaDto) {
    return this.reservasService.comprobarDisponibilidad(comprobarDisponibilidad);
  }

  @Post('verValoraciones')
  verValoraciones() {
    return this.reservasService.verValoraciones();
  }

  @Post('getReservasUser')
  getReservasUser(@Body() email:string){
    return this.reservasService.getReservasUser(email)
  }
}
