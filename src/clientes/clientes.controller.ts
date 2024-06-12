/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}


  @UseGuards(JwtAuthGuard)
  @Post('reservas')
  verReservas(@Body('email') email: string) {
    return this.clientesService.verReservas(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('info')
  verInfoCliente(@Body('email') email: string) {
    return this.clientesService.verInfoCliente(email);
  }
  @UseGuards(JwtAuthGuard)
  @Post('update')
  updateCliente(@Body() updateClientDto:UpdateClienteDto) {
    return this.clientesService.updateCliente(updateClientDto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('eliminarCliente')
  eliminarCliente(@Body() email:string) {
    return this.clientesService.eliminarCliente(email);
  }
}
