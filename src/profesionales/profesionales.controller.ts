import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto';

@Controller('profesionales')
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Post()
  create(@Body() createProfesionaleDto: CreateProfesionaleDto) {
    return this.profesionalesService.create(createProfesionaleDto);
  }

  @Get()
  findAll() {
    return this.profesionalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesionalesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfesionaleDto: UpdateProfesionaleDto) {
    return this.profesionalesService.update(+id, updateProfesionaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profesionalesService.remove(+id);
  }
}
