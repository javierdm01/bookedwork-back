/* eslint-disable prettier/prettier */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {compare,hash} from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/LoginAuth.dto';
import { EmailService } from 'src/email/email.service';
import { RegisterAuthDto } from './dto/RegisterAuth.dto';
import { ConexionesService } from 'src/conexiones/conexiones.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,

        private jwtService: JwtService,
        
        @Inject(EmailService)
        private readonly emailService: EmailService,

        @Inject(ConexionesService)
        private readonly conexionesService: ConexionesService
    ){
        
    }

    async loginClient(clientDto: LoginAuthDto): Promise<{cliente:Cliente, token:string}> {
        const {email, contrasena} = clientDto;
        const cli= await this.clienteRepository.findOne({where: {email}});

        //Comprobacion de que el cliente existe

        if (!cli) throw new HttpException('Invalid credentials', 404);

        const isPasswordValid= await compare(contrasena, cli.contrasena)

        if (!isPasswordValid) throw new HttpException('Invalid credentials', 404);

        if(!cli.activated) throw new HttpException('Account not activated', 401);


        const token= this.jwtService.sign({id: cli.id_cliente, email: cli.email});
        const ip= await this.getIp()
        await this.conexionesService.createNewConexiones({ip, cliente: cli});

        

        //Retornamos el cliente y el token
        return {cliente: cli, token};

    }

    async registerClient(clientDto: RegisterAuthDto){
        console.log(clientDto);
        
        const {email,contrasena} = clientDto;
        const cli= await this.clienteRepository.findOne({where: {email}});

        //Si el cliente ya existe lanzamos un error
        if(cli) throw new HttpException('Client already exists', 409);

        //Creamos el nuevo cliente y lo guardamos
        const newClient= this.clienteRepository.create({
            ...clientDto,
            contrasena: await hash(contrasena, 10) ,
            activated:true
        });
        await this.clienteRepository.save(newClient);

        
        await this.emailService.sendEmail(email,newClient.activation_token);

        return newClient;

    }

    //Retornar IP cliente
    async getIp(): Promise<string>{
        const ip= await fetch('https://api.ipify.org?format=json')
        .then(response=>response.json())
        .then(data=>data.ip);
        return ip;
    }
}
