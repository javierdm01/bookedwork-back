/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
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
    if (createReservaDto.fechaServicio < new Date())
      throw new Error('La fecha de servicio no puede ser anterior a la actual');
    const cliente = await this.clienteRepository.findOne({
      where: { email: createReservaDto.emailCliente },
    });
    if (!cliente) throw new Error('Cliente no encontrado');
    const servicio = await this.servicioRepository.findOne({
      where: { id_servicio: createReservaDto.idServicio },
    });
    if (!servicio) throw new Error('Servicio no encontrado');
    const negocio = await this.negocioRepository.findOne({
      where: {servicios: servicio },
    });
    if (!negocio) throw new Error('Negocio no encontrado');
    const profesional = await this.profesionalRepository.findOne({
      where: { id_profesional: createReservaDto.idProfesional },
    });
    if (!profesional) throw new Error('Profesional no encontrado');
    const reservasExistentes = await this.reservaRepository.find({
      where: { 
        profesional: profesional,
       },
       relations: {servicio: true},
    });
    reservasExistentes.forEach((reserva) => {
      
      const duracion = reserva.servicio.duracion;
      const fechaInicio = reserva.fechaServicio;
      const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);
    
      const fechaServicio = new Date(createReservaDto.fechaServicio);
    
      if (
        fechaServicio.getTime() >= fechaInicio.getTime() &&
        fechaServicio.getTime() < fechaFin.getTime()
      ) {
        throw new Error(
          'El profesional ya tiene una reserva en esa franja horaria',
        );
      }
    });
    

    const token = await hash(
      createReservaDto.emailCliente + createReservaDto.fechaServicio,
      10,
    );
    const reserva = await this.reservaRepository.create({
      ...createReservaDto,
      token,
      cliente,
      profesional,
      coste: servicio.coste,
      servicio,
      fechaReserva: new Date(),
    });
     
    await this.reservaRepository.save(reserva);
    this.emailService.sendEmailReserva(
      reserva.cliente.email,
      reserva.cliente.nombre,
      negocio.nombre,
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

  async comprobarDisponibilidad({id_servicio, fecha}:{id_servicio: number, fecha: Date}){
    const horarios = [];
    const servicio = await this.servicioRepository.findOne({where: {id_servicio}});
    if (!servicio) throw new Error('Servicio no encontrado');
    const profesional = await this.profesionalRepository.findOne({where: {servicios: servicio}});
    if (!profesional) throw new Error('Profesional no encontrado');
    const reservas = await this.reservaRepository.find({where: {profesional}, relations: {servicio: true}});
    reservas.forEach(reserva => {
      const duracion = reserva.servicio.duracion;
      const fechaInicio = reserva.fechaServicio;
      const fechaFin = new Date(fechaInicio.getTime() + duracion * 60000);
      if (fecha.getTime() >= fechaInicio.getTime() && fecha.getTime() < fechaFin.getTime()){
        horarios.push(fechaInicio);
      }
    });
    return horarios;
  }

  async verValoraciones(){
    const valoraciones= await this.reservaRepository.find({
      take:8,
      relations:['servicio','profesional','cliente','servicio.negocios']
  })
  console.log(valoraciones[0].servicio.negocios)
  return valoraciones
  }

 
}
