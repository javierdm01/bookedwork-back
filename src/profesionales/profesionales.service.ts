import { Injectable } from '@nestjs/common';
import { CreateProfesionaleDto } from './dto/create-profesionale.dto';
import { UpdateProfesionaleDto } from './dto/update-profesionale.dto';

@Injectable()
export class ProfesionalesService {
  create(createProfesionaleDto: CreateProfesionaleDto) {
    return 'This action adds a new profesionale';
  }

  findAll() {
    return `This action returns all profesionales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profesionale`;
  }

  update(id: number, updateProfesionaleDto: UpdateProfesionaleDto) {
    return `This action updates a #${id} profesionale`;
  }

  remove(id: number) {
    return `This action removes a #${id} profesionale`;
  }
}
