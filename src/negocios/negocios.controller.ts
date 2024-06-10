/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SubirImagenesDto } from './dto/subir-imagenes.dto';


@Controller('negocios')
export class NegociosController {
  constructor(private readonly negociosService: NegociosService) {}


  @Post('buscarNegocios')
  buscarNegocios(@Body() buscarNegocio: BuscarNegocioDto) {
    return this.negociosService.buscarNegociosPorCriterios(buscarNegocio);
  }

  @Post('subirImagenNegocio')
  @UseInterceptors(FilesInterceptor('files')) // Interceptor para manejar archivos en la solicitud
  uploadFile(@Body() subirImg: SubirImagenesDto, @UploadedFiles() files: Array<Express.Multer.File>){
    return this.negociosService.subirImagenesNegocios(subirImg.email,files);
  }

  @Post('verReservas')
  verReservas(@Body() email: string) {
    return this.negociosService.verReservas({re:email});
  }

}
