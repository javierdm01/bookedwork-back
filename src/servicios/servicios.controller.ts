/* eslint-disable prettier/prettier */
import { Body, Controller, Post} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post('createServices')
  crearServicios(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.crearServicios(createServicioDto);
  }

}
