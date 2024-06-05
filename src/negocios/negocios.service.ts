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
    /*
    async buscarNegocios(buscarNegocio: BuscarNegocioDto) {
        const { nombre, direccion, fechaServicio } = buscarNegocio;
        console.log(buscarNegocio);
        
        if (nombre) {
            // Búsqueda por categoría y ciudad
            const categoriaQuery = await this.negocioRepository.find({
                where: [
                    {
                        categoria: Raw(alias => `unaccent(lower(${alias})) ILIKE unaccent(lower('%${nombre}%'))`),
                        direccion: Raw(alias => `unaccent(lower(${alias} ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`)
                    },
                    {
                        nombre: Raw(alias => `unaccent(lower(${alias})) ILIKE unaccent(lower('%${nombre}%'))`),
                        direccion: Raw(alias => `unaccent(lower(${alias} ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`)
                    }
                ]
            });
    
            // Búsqueda por servicio y ciudad
            const servicioQuery = await this.negocioRepository.find({
                where: {
                    servicios: {
                        nombre: Raw(alias => `unaccent(lower(${alias})) ILIKE '%' || unaccent(lower('${nombre}')) || '%'`)
                    },
                    direccion: Raw(alias => `unaccent(lower(${alias} ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`)
                },
                relations: ['servicios']
            });
    
            // Filtrar servicios por fecha de servicio
            const filteredServicioQuery = await Promise.all(servicioQuery.map(async (negocio) => {
                const reservas = await this.verReservas({ re: negocio });
                const availableServicios = negocio.servicios.filter(servicio => {
                    return reservas.every(reserva => {
                        const duracionEnMilisegundos = reserva.servicio.duracion * 60 * 1000;
                        const fechaFinServicio = new Date(reserva.fechaServicio.getTime() + duracionEnMilisegundos);
                        return fechaServicio < reserva.fechaServicio || fechaServicio > fechaFinServicio;
                    });
                });
                if (availableServicios.length > 0) {
                    return { ...negocio, servicios: availableServicios };
                }
                return null;
            }));
    
            return { categoriaQuery, servicioQuery: filteredServicioQuery.filter(negocio => negocio !== null) };
        } else {
            const servicios = await this.negocioRepository.find({
                where: {
                    direccion: Raw(alias => `unaccent(lower(${alias} ->> 'ciudad')) ILIKE '%' || unaccent(lower('${(direccion as any).ciudad}')) || '%'`)
                }
            });
            console.log(servicios, (direccion as any).ciudad);
            return { servicios };
        }
    }*/
    async buscarNegociosPorCriterios(buscarNegocio: BuscarNegocioDto) {
        const { nombre, fecha, ubicacion, horario } = buscarNegocio;
        console.log(buscarNegocio)
        
        // Get the day of the week from the date
        const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado','domingo'];
        const nDia=new Date(fecha).getUTCDay()
        const diaSemana = diasSemana[nDia];
        console.log(diaSemana)
        const negocios = await this.negocioRepository.find({
          where: [
            {
                direccion: Raw(alias => `unaccent(lower(${alias} ->> 'ciudad')) ILIKE '%' || unaccent(lower('${ubicacion.ciudad}')) || '%'`),
            }
          ],
          relations: ['servicios']
        });
        const negocioFiltrados= negocios.filter(negocio=>
            negocio.categoria.toLowerCase().includes(nombre.toLowerCase()) ||
            negocio.nombre.toLowerCase().includes(nombre.toLowerCase())
        )
        console.log(negocioFiltrados)
        return negocioFiltrados

      }
    
    async allNegocios(): Promise<Negocio[]> {
        return this.negocioRepository.find();
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
 