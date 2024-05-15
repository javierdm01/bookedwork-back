/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { Raw, Repository } from 'typeorm';
import { Negocio } from './entities/negocio.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class NegociosService {
  constructor(
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
  ) {}

    //Buscar Negocios
    async buscarNegocios(buscarNegocio: BuscarNegocioDto) {
        const { nombre, direccion } = buscarNegocio;
        //Busquedad por categoría y ciudad
        const categoriaQuery = await this.negocioRepository.find({
            where: [{
                 
                    categoria: Raw(() => `unaccent(lower(categoria)) ILIKE unaccent(lower('%${nombre}%'))`) 
                ,
                
                    direccion: Raw(() => `unaccent(lower(direccion ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`) 
                
            },
            {
                    nombre: Raw(() => `unaccent(lower(nombre)) ILIKE unaccent(lower('%${nombre}%'))`) 
                    ,
                    
                    direccion: Raw(() => `unaccent(lower(direccion ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`) 
            }
        ]
        });
        //Busquedad por servicio y ciudad
        const servicioQuery = await this.negocioRepository.find({
            where: 
                {
                    servicios: {
                        nombre: Raw(alias => `unaccent(lower(${alias})) ILIKE '%' || unaccent(lower('${nombre}')) || '%'`)
                    },
                    direccion: Raw(() => `unaccent(lower(direccion ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`)
                },
        });
        
        //Retornamos primero la categoría y luego el servicio, ya que la categoría tiene prioridad
        return {categoriaQuery,servicioQuery};


    }

}
 