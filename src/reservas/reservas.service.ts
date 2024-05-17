/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import {  Repository, UpdateResult } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { hash } from 'bcrypt';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Negocio } from 'src/negocios/entities/negocio.entity';
import { Profesional } from 'src/profesionales/entities/profesionales.entity';

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

  ) {}

  //Crear una reserva 
  async crearReserva(createReservaDto: CreateReservaDto) {
    if(createReservaDto.fechaServicio<new Date()) throw new Error('La fecha de servicio no puede ser anterior a la actual')
    const cliente=await this.clienteRepository.findOne({where: {email: createReservaDto.emailCliente}})
    if(!cliente) throw new Error('Cliente no encontrado')
    const servicio=await this.negocioRepository.findOne({where: {id_negocio: createReservaDto.idServicio}})
    if(!servicio) throw new Error('Servicio no encontrado')
    const profesional=await this.profesionalRepository.findOne({where: {id_profesional: createReservaDto.idProfesional}})
    if(!profesional) throw new Error('Profesional no encontrado')
    const token=await hash(createReservaDto.emailCliente+createReservaDto.fechaServicio,10)
    const reserva=await this.reservaRepository.create({
      ...createReservaDto,
      token, 
      cliente,
      servicio,
      profesional,
      fechaReserva: new Date(),
    })
    await this.reservaRepository.save(reserva)
    this.emailService.sendEmailReserva(reserva.cliente.email,reserva.cliente.nombre,reserva.servicio.negocios.nombre,reserva.fechaServicio);

  }

  //Modificar el estado de una reserva
  async modificarEstado(id: number) : Promise<UpdateResult>{
    const reserva=await this.reservaRepository.findOne({where: {id_reserva: id}})
    if(!reserva) throw new Error('Reserva no encontrada')
    this.emailService.sendEmailValoraciones(reserva.cliente.email,reserva.cliente.nombre,reserva.servicio.negocios.nombre,reserva.token);
    return this.reservaRepository.update(id, {estado: 'finalizada'});
  }

  //Valorar una reserva
  async valorarReserva(token: string, valoracion: number,comentario?: string) {
    const reserva=await this.reservaRepository.findOne({where: {token}})
    if(!reserva) throw new Error('Reserva no encontrada')
    this.reservaRepository.update(reserva.id_reserva, {valoracion,comentario});
  }

  //Cancelar una reserva
  async cancelarReserva(id_reserva?: number,token?:string) :Promise<UpdateResult>{
    const reserva=await this.reservaRepository.findOne({where: {token}})
    const reservaId=await this.reservaRepository.findOne({where: {id_reserva}})
    if(!reserva && !reservaId) throw new Error('Reserva no encontrada')
    this.emailService.sendEmailCancelacion(reserva.cliente.email,reserva.cliente.nombre,reserva.servicio.negocios.nombre,reserva.fechaServicio);
    return this.reservaRepository.update(reserva.id_reserva, {estado: 'Cancelada'});
  }


}
