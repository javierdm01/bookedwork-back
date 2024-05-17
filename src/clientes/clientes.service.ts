/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,

    @Inject(S3Service)
    private readonly s3Service: S3Service,

    @InjectRepository(Reserva)
    private reservasRepository: Repository<Reserva>,
  ){}

  async verReservas(email: string) : Promise<Reserva[]>{
    const cliente=await this.clienteRepository.findOne({where: {email}})
    if(!cliente) throw new Error('Cliente no encontrado')
    return this.reservasRepository.find({where: {cliente}})
  }

  async verInfoCliente(email: string) : Promise<Partial<Cliente>>{
    const cliente=await this.clienteRepository.findOne({where: {email}})
    if(!cliente) throw new Error('Cliente no encontrado')
    return {
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      avatar: cliente.avatar,
    } 
  }
  async updateCliente(modificarCliente:UpdateClienteDto):Promise<Cliente>{
    const cliente=await this.clienteRepository.findOne({where: {email:modificarCliente.email}})
    if(!cliente) throw new Error('Cliente no encontrado')
    if(modificarCliente.nombre) cliente.nombre=modificarCliente.nombre
    if(modificarCliente.telefono) cliente.telefono=modificarCliente.telefono
    if(modificarCliente.avatar){
      if(cliente.avatar){
        await this.s3Service.deleteFile('https://bookedwork-img.s3.eu-north-1.amazonaws.com/negocio/Cositas+ricas/Cositas+ricas-2024-05-16T11%3A11%3A34.441Z')
      }
      //cliente.avatar=await this.s3Service.upload(modificarCliente.avatar)
    }
    await this.clienteRepository.save(cliente)
    return cliente
  }


  
}
