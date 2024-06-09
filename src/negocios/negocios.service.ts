/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BuscarNegocioDto } from './dto/buscar-negocio.dto';
import { Raw, Repository,Not, IsNull } from 'typeorm';
import { Negocio } from './entities/negocio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { VerValoracionesDto } from './dto/verValoraciones.dto';


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
        const { categoria, fecha, ubicacion, horario } = buscarNegocio;
        console.log(buscarNegocio)
        
        // Get the day of the week from the date
        const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado','domingo'];
        const nDia=new Date(fecha).getUTCDay()
        const diaSemana = diasSemana[nDia];
        console.log(ubicacion.ciudad)
        const negocios = await this.negocioRepository.find({
          where: [
            {
                direccion: Raw(alias => `unaccent(lower(${alias} ->> 'ciudad')) ILIKE '%' || unaccent(lower('${ubicacion.ciudad}')) || '%'`),
            }
          ],
          relations: ['servicios']
        });
        console.log(categoria)
        console.log('categorio',categoria)
        console.log(negocios)
        if(negocios){
            if(!categoria) return negocios
            const negocioFiltrados= negocios.filter(negocio=>
                negocio.categoria.toLowerCase().includes(categoria.toLowerCase()) ||
                negocio.nombre.toLowerCase().includes(categoria.toLowerCase())
            )
            if(horario){
                const negocioDate= negocioFiltrados.filter(negocio=>
                    negocio.horario[diaSemana]!=null
                )
                return negocioDate
            }
            console.log(negocioFiltrados)
            return negocioFiltrados
        }
        

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
      
    async getNegocios(obj:object){
        const id= obj['id']
        console.log(obj)
        const bucle= (id-1)*10 //5 es el numero de saltos que quiero que me saque
        const negocios=await this.negocioRepository.count()

        if(bucle >= negocios) throw new NotFoundException(' No se encuentran mas negocios disponibles')
        
        return this.negocioRepository.find({
            skip:bucle,
            take:5,
            order:{
                id_negocio:"DESC"
            }
        })
    }

    async verValoraciones(negocio:VerValoracionesDto){
        const email= negocio.email
        console.log(email)
        const negocioEncontrado= await this.negocioRepository.findOne({where:{email}})
        if(!negocioEncontrado) throw new HttpException('El negocio es incorrecto',404)
            console.log(negocioEncontrado)
            const reservasConValoraciones = await this.reservaRepository.find({
                where: { 
                    servicio: { 
                        negocios: { id_negocio: negocioEncontrado.id_negocio } 
                    },
                    valoracion: Not(IsNull()),
                    comentario: Not(IsNull()),
                    titulo: Not(IsNull()) 
                    
                },
                relations: ['servicio','cliente'] // Cargar la relación con servicio para obtener los datos necesarios
            });
            console.log(reservasConValoraciones)
            return reservasConValoraciones
        
      }

    async getOneNegocio(nombre:string){
        try {
            const negocio= await this.negocioRepository.findOne({where:{nombre},relations:['servicios','servicios.profesionales']})
            if(!negocio) throw new Error("El nombre del negocio no existe");
            return negocio
        } catch (error) {
            return error
        }
    }
      

}
 