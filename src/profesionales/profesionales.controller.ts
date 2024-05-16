/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';


@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Post('crearProfesional')
  crearProfesional(@Body() createProfesionaleDto: CreateProfesionaleDto) {
    return this.profesionalesService.crearProfesional(createProfesionaleDto);
  }

}
