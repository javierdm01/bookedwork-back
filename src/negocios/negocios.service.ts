/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { Raw, Repository } from 'typeorm';
import { Negocio } from './entities/negocio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';


@Injectable()
export class NegociosService {
  constructor(
    @InjectRepository(Negocio)
    private readonly negocioRepository: Repository<Negocio>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
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
        
        if(servicioQuery){
            servicioQuery.forEach(async (negocio) => {
                const reservas= await this.verReservas({re:negocio})
                reservas.forEach(async (reserva) => {
                    const duracionEnMilisegundos = reserva.servicio.duracion * 60 * 1000;
                    const fechaFinServicio = new Date(reserva.fechaServicio.getTime() + duracionEnMilisegundos);
                    if(buscarNegocio.fechaServicio<reserva.fechaServicio || buscarNegocio.fechaServicio>fechaFinServicio){
                        negocio.servicios.map((servicio) =>{
                            if(reserva.servicio==servicio){
                                servicioQuery.splice(servicioQuery.indexOf(negocio),1)
                            } 
                        })
                        
                    }
                })
            })
        }
        //Retornamos primero la categoría y luego el servicio, ya que la categoría tiene prioridad
        return {categoriaQuery,servicioQuery};


    }

    async verReservas({ re }): Promise<Reserva[]> {
        const { email } = re;
        
        // Buscar el negocio por email, incluyendo sus servicios
        const negocio = await this.negocioRepository.findOne({
          where: { email },
          relations: { servicios: true },
        });
      
        if (!negocio) throw new Error('Negocio no encontrado');
        
        const services = [];
      
        // Utilizar un bucle for...of para iterar sobre los servicios
        for (const servicio of negocio.servicios) {
          const reservas = await this.reservaRepository.find({ where: { servicio } });
          services.push(...reservas);
        }
        return services;
      }
      

}
 