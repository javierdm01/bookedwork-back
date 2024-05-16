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
import { Negocio } from 'src/negocios/entities/negocio.entity';
import { RegisterNegocioAuthDto } from './dto/RegisterNegocioAuth.dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,

        private jwtService: JwtService,
        
        @Inject(EmailService)
        private readonly emailService: EmailService,

        @Inject(ConexionesService)
        private readonly conexionesService: ConexionesService,
        
        @InjectRepository(Negocio)
        private negocioRepository: Repository<Negocio>,

        @Inject(S3Service)
        private readonly s3Service: S3Service,

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

        //Obtengo el token
        const token= this.jwtService.sign({id: cli.id_cliente, email: cli.email});

        //Obtengo la IP del cliente
        const ip= await this.getIp()

        //Guardamos la conexion
        const conexion=await this.conexionesService.createNewConexiones({ip, cliente: cli});
        if(!conexion) throw new HttpException('IP uknonwn', 409);
        await this.emailService.ipLocation(cli.email,`http://localhost:3000/conexiones/${token}`);

        

        //Retornamos el cliente y el token
        return {cliente: cli, token};

    }

    async registerClient(clientDto: RegisterAuthDto){
        
        const {email,contrasena} = clientDto;
        const cli= await this.clienteRepository.findOne({where: {email}});

        //Si el cliente ya existe lanzamos un error
        if(cli) throw new HttpException('Client already exists', 409);

        //Creamos el nuevo cliente y lo guardamos
        
        const newClient= this.clienteRepository.create({
            ...clientDto,
            contrasena: await hash(contrasena, 10) ,
            activated:true,
        });
        await this.clienteRepository.save(newClient);

        

        await this.emailService.sendEmail(email,newClient.activation_token);

        return newClient;

    }

    async activateClient({email, token}:{email: string, token: number}){
        const cli= await this.clienteRepository.findOne({where: {email: email, activation_token: token}});
        if(!cli) throw new HttpException('Invalid pass', 404);

        cli.activated=true;
        await this.clienteRepository.save(cli);

        return cli;
    }

    async checkToken({token}:{token:string}): Promise<any>{
        try {
            const decoded= this.jwtService.verify(token);
            return decoded
        } catch (error) {
            throw new HttpException('Error Verification Token', 404);
        }
    }

    async forggetPassword(email: string){
        try {
            const cli= await this.clienteRepository.findOne({where: {email}});
            if(!cli) throw new HttpException('Client not found', 404);
            const token=this.jwtService.sign({email:email});
            await this.emailService.forgottenPassword(email,`http://localhost:3000/resetPassword/${token}`);
            return true;
        } catch (error) {
            return false;
        }
    }
    async resetPassword({token, contrasena}:{token:string, contrasena:string}){
        try {
            const decoded=await this.checkToken({token});
            if(!decoded) throw new HttpException('Invalid token', 404);

            const cli= await this.clienteRepository.findOne({where: {email: decoded.email}});
            if(!cli) throw new HttpException('Client not found', 404);

            cli.contrasena= await hash(contrasena, 10);
            await this.clienteRepository.save(cli);
            
            return true;
        } catch (error) {
            return false;
        }
    }

    //Retornar IP cliente
    async getIp(): Promise<string>{
        const ip= await fetch('https://api.ipify.org?format=json')
        .then(response=>response.json())
        .then(data=>data.ip);
        return ip;
    }

    async registerNegocio(negocioDto: RegisterNegocioAuthDto,imagenes: Array<Express.Multer.File>){
            
            const {email,nombre,contrasena,CIF} = negocioDto;
            const neg= await this.negocioRepository.findOne({where:[
                {email},
                {nombre},
                {CIF}
            ] });
    
            //Si el negocio ya existe lanzamos un error
            if (neg) throw new HttpException('Negocio already exists', 409);
            const imagenesArray= await this.s3Service.uploadFile(nombre,'negocio',imagenes);
            //Creamos el nuevo negocio y lo guardamos
            const newNegocio = this.negocioRepository.create({
                ...negocioDto,
                contrasena: await hash(contrasena, 10),
                activated: true,
                imagenes: imagenesArray,
            });
            await this.negocioRepository.save(newNegocio);

            await this.emailService.sendMailNegocio(email, newNegocio.activation_token);

            return newNegocio;

    }
}
