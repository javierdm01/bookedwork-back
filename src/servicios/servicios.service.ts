/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { Repository } from 'typeorm';
import { Profesional } from 'src/profesionales/entities/profesionales.entity';
import { Negocio } from 'src/negocios/entities/negocio.entity';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
    @InjectRepository(Profesional)
    private profesionalRepository: Repository<Profesional>,
    @InjectRepository(Negocio)
    private negocioRepository: Repository<Negocio>,
  ){}

  async crearServicios(createServicioDto: CreateServicioDto) {
    const {coste, nombre, descripcion, etiquetas, duracion, profesionales, negocio} = createServicioDto;
    
    //Buscar todos los negocios
    const negociosExistentes= await this.negocioRepository.findOne({ where: { id_negocio: negocio } });

    if(!negociosExistentes){
      throw new BadRequestException('El negocio proporcionado no existe');
    }

    //Buscar todos los profesionales
    const profesionalesExistentes = await Promise.all(
      profesionales.map(async (profesionalId) => {
        return await this.profesionalRepository.findOne({ where: { id_profesional: profesionalId } });
      })
    );    
    
    if (profesionalesExistentes.length !== profesionales.length) {
      throw new BadRequestException('Alguno de los profesionales proporcionados no existe');
    }
    
    const servicio = this.servicioRepository.create({
      coste,
      nombre,
      descripcion,
      etiquetas,
      duracion,
      profesionales: profesionalesExistentes,
      negocios: negociosExistentes,
    });

    return  await this.servicioRepository.save(servicio);

  }
}
