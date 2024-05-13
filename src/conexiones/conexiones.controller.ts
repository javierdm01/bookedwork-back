/* eslint-disable prettier/prettier */
import { Controller} from '@nestjs/common';
import { ConexionesService } from './conexiones.service';

@Controller('conexiones')
export class ConexionesController {
  constructor(private readonly conexionesService: ConexionesService) {}

  
}
