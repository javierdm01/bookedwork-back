/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { CreateNegocioDto } from './dto/create-negocio.dto';


@Controller('negocios')
export class NegociosController {
  constructor(private readonly negociosService: NegociosService) {}

}
