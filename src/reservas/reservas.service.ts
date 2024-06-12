/* eslint-disable prettier/prettier */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { Repository, UpdateResult } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { hash } from 'bcrypt';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Negocio } from 'src/negocios/entities/negocio.entity';
import { Profesional } from 'src/profesionales/entities/profesionales.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { addDays, addMinutes, differenceInDays } from 'date-fns';
import { HorarioInterface } from './dto/horarioInterface';  

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @Inject(EmailService)
    private emailService: EmailService,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Negocio)
    private negocioRepository: Repository<Negocio>,
    @InjectRepository(Profesional)
    private profesionalRepository: Repository<Profesional>,
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
  ) {}

  //Crear una reserva
  async crearReserva(createReservaDto: CreateReservaDto) {
    const { fechaServicio, emailCliente, idServicio, idProfesional } = createReservaDto;

    // Validación de la fecha del servicio
    if (new Date(fechaServicio) < new Date()) {
      throw new Error('La fecha de servicio no puede ser anterior a la actual');
    }

    // Buscar cliente por email
    const cliente = await this.clienteRepository.findOne({ where: { email: emailCliente } });
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    // Buscar servicio por id
    const servicio = await this.servicioRepository.findOne({ where: { id_servicio: idServicio } });
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }

    // Buscar profesional por id
    const profesional = await this.profesionalRepository.findOne({ where: { id_profesional: idProfesional } });
    if (!profesional) {
      throw new Error('Profesional no encontrado');
    }

    // Verificar disponibilidad del profesional
    const reservasExistentes = await this.reservaRepository.find({
      where: { profesional: {
        id_profesional:profesional.id_profesional
      } },
      relations: ['servicio', 'profesional'],
    });

    const fechaInicioNuevaReserva = new Date(fechaServicio);
    reservasExistentes.forEach((reserva) => {
      const duracion = reserva.servicio.duracion;
      const fechaInicio = reserva.fechaServicio;
      const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);

      if (
        fechaInicioNuevaReserva >= fechaInicio &&
        fechaInicioNuevaReserva < fechaFin
      ) {
        throw new Error('El profesional ya tiene una reserva en esa franja horaria');
      }
    });

    // Crear el token
    const token = await hash(emailCliente, 10);

    // Crear la reserva
    const reserva = this.reservaRepository.create({
      ...createReservaDto,
      token,
      cliente,
      profesional,
      coste: servicio.coste,
      servicio,
      fechaReserva: new Date(),
    });

    // Guardar la reserva
    await this.reservaRepository.save(reserva);

    // Enviar correo de confirmación
    this.emailService.sendEmailReserva(
      reserva.cliente.email,
      reserva.cliente.nombre,
      servicio.nombre, // Suponiendo que el nombre del negocio es el mismo que el del servicio
      reserva.fechaServicio,
    );
    return reserva;
  }


  //Modificar el estado de una reserva
  async modificarEstado(id: number): Promise<UpdateResult> {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva: id },
    });
    if (!reserva) throw new Error('Reserva no encontrada');
    this.emailService.sendEmailValoraciones(
      reserva.cliente.email,
      reserva.cliente.nombre,
      reserva.servicio.negocios.nombre,
      reserva.token,
    );
    return this.reservaRepository.update(id, { estado: 'finalizada' });
  }

  //Valorar una reserva
  async valorarReserva(token: string, valoracion: number, comentario?: string) {
    const reserva = await this.reservaRepository.findOne({ where: { token } });
    if (!reserva) throw new Error('Reserva no encontrada');
    this.reservaRepository.update(reserva.id_reserva, {
      valoracion,
      comentario,
    });
  }

  //Cancelar una reserva
  async cancelarReserva(
    id_reserva?: number,
    token?: string,
  ): Promise<UpdateResult> {
    const reserva = await this.reservaRepository.findOne({ where: { token } });
    const reservaId = await this.reservaRepository.findOne({
      where: { id_reserva },
    });
    if (!reserva && !reservaId) throw new Error('Reserva no encontrada');
    this.emailService.sendEmailCancelacion(
      reserva.cliente.email,
      reserva.cliente.nombre,
      reserva.servicio.negocios.nombre,
      reserva.fechaServicio,
    );
    return this.reservaRepository.update(reserva.id_reserva, {
      estado: 'Cancelada',
    });
  }

  
  async comprobarDisponibilidad({ id_profesional, id_servicio, fecha }: { id_profesional: number, id_servicio: number, fecha: Date }) {
    console.log(id_profesional, id_servicio, fecha);
    const servicio = await this.servicioRepository.findOne({ where: { id_servicio } });
    if (!servicio) throw new Error('Servicio no encontrado');
    
    const profesional = await this.profesionalRepository.findOne({ where: { id_profesional } });
    if (!profesional) throw new Error('Profesional no encontrado');

    const reservas= await this.reservaRepository.find({
      where: { profesional: { id_profesional: profesional.id_profesional } },
      relations: ['servicio', 'profesional'],
    });
    const reservasHoy= reservas.filter(reserva => differenceInDays(reserva.fechaServicio, addDays(fecha, 1))==0);
    const horario: HorarioInterface[] = [];

    if (reservasHoy.length === 0) {
        return false;
    } else {
        reservasHoy.forEach((reserva) => {
          const fechaIncial=((reserva.fechaServicio.getUTCHours()/10 <1 ? '0' : '') + (reserva.fechaServicio.getUTCHours())) + ':' + ((reserva.fechaServicio.getUTCMinutes()/10 <1 ? '0' : '') + (reserva.fechaServicio.getUTCMinutes()));
          const fechaAnadida=addMinutes(reserva.fechaServicio,reserva.servicio.duracion)
          const fechaFinal=((fechaAnadida.getUTCHours()/10 <1 ? '0' : '') + (fechaAnadida.getUTCHours())) + ':' + ((fechaAnadida.getUTCMinutes()/10 <1 ? '0' : '') + (fechaAnadida.getUTCMinutes()));
            
          const horaInicio = fechaIncial
          const horaFin = fechaFinal
          horario.push({
              horaInicio: horaInicio,
              horaFin: horaFin,
          });
        });
    }

    return horario

}


  async verValoraciones(){
    const valoraciones= await this.reservaRepository.find({
      take:8,
      relations:['servicio','profesional','cliente','servicio.negocios']
  })
  return valoraciones
  }

  async getReservasUser(email: string): Promise<Reserva[]> {
    console.log(email);

    // Buscar al cliente por su email
    const cli = await this.clienteRepository.findOne({ where: { email:email['email'] } });
    console.log(cli);

    if (!cli) {
      throw new HttpException('No se encuentra el cliente', 404);
    }

    // Buscar reservas por el ID del cliente
    const reserva = await this.reservaRepository.find({ where: { cliente: {
      id_cliente: cli.id_cliente
    } }, relations:['cliente','profesional','servicio','servicio.negocios'] });
    console.log(reserva);

    return reserva;
  }
 
}
