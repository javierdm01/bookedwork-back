/* eslint-disable prettier/prettier */
import { HttpException, Inject, Injectable } from '@nestjs/common';
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

  async verInfoCliente(email: string) {
    const cliente=await this.clienteRepository.findOne({where: {email}})
    if(!cliente) throw new Error('Cliente no encontrado')
    return {
      nombre: cliente.nombre,
      apellidos:cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      avatar: cliente.avatar,
      fechaNacimiento: cliente.fecha_nacimiento,
      direccion:cliente.direccion
    } 
  }
  async updateCliente(modificarCliente:UpdateClienteDto):Promise<Cliente>{
    console.log(modificarCliente)
    const cliente=await this.clienteRepository.findOne({where: {email:modificarCliente['data'].email}})
    if(!cliente) throw new Error('Cliente no encontrado')
    
    if(modificarCliente['data'].avatar){
      if(cliente.avatar){
        await this.s3Service.deleteFile(cliente.avatar)
      }
      }
      const avatar= modificarCliente['data'].avatar ? modificarCliente['data'].avatar : cliente.avatar
      
    const clienteUpdate: Partial<Cliente>={
      ...modificarCliente['data'],
      avatar:avatar
   }
  
    const upd=await this.clienteRepository.update(cliente.id_cliente,clienteUpdate)
    
    await this.clienteRepository.save(cliente)
    console.log(cliente)
    return cliente
  }

  async eliminarCliente(email:string){
    const mail= email['email']
    const cli=await this.clienteRepository.findOne({where:{email:mail}})
    if(!cli) throw new HttpException('No se encuentra el cliente',404)
    return await this.clienteRepository.delete(cli)
  }

  
}
