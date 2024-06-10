/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NegociosService } from './negocios.service';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { VerValoracionesDto } from './dto/verValoraciones.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SubirImagenesDto } from './dto/subir-imagenes.dto';


@Controller('negocios')
export class NegociosController {
  constructor(private readonly negociosService: NegociosService) {}


  @Post('buscarNegocios')
  buscarNegocios(@Body() buscarNegocio: BuscarNegocioDto) {
    return this.negociosService.buscarNegociosPorCriterios(buscarNegocio);
  }

  @Post('getOneNegocio')
  getOneNegocio(@Body() name: object) {
    return this.negociosService.getOneNegocio(name['nombre']);
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

  @Post('getNegocios')
  getNegocios(@Body() obj:object){
    return this.negociosService.getNegocios(obj)
  }
  @Post('verValoraciones')
  verValoraciones(@Body() obj:VerValoracionesDto){
    return this.negociosService.verValoraciones(obj)
  }
}
