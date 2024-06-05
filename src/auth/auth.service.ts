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
        console.log(cli)
        //Comprobacion de que el cliente existe

        if (!cli) throw new HttpException('Correo o contraseña invalida', 404);

        const isPasswordValid= await compare(contrasena, cli.contrasena)

        if (!isPasswordValid) throw new HttpException('Correo o contraseña invalida', 404);

        if(!cli.activated) throw new HttpException('La cuenta no está activada', 401);

        //Obtengo el token
        const token= this.jwtService.sign({id: cli.id_cliente, email: cli.email});

        //Obtengo la IP del cliente
        const ip= await this.getIp()

        //Guardamos la conexion
        const conexion=await this.conexionesService.createNewConexiones({ip, cliente: cli});
        if(!conexion) throw new HttpException('IP Desconocida', 409);
        await this.emailService.ipLocation(cli.email,`http://localhost:3000/conexiones/${token}`);

        //Retornamos el cliente y el token
        return {cliente: cli, token};

    }

    async registerClient(clientDto: RegisterAuthDto){
        try {
            const {email,contrasena} = clientDto;
            console.log(clientDto)
            const telf=clientDto.telefono.split('+34')[1].trim()
            const cli= await this.clienteRepository.findOne({where: [{email},{telefono:telf}]});

        //Si el cliente ya existe lanzamos un error
        if(cli) throw new HttpException('Ya hay un cliente asociado al correo o al número de teléfono.', 409);

        //Creamos el nuevo cliente y lo guardamos
        const hasedPassword=contrasena ?await hash(contrasena, 10):''
        const newClient= this.clienteRepository.create({
            ...clientDto,
            telefono:telf,
            contrasena: hasedPassword,
        });
        const newCli=await this.clienteRepository.save(newClient);
        if(!newCli) throw new HttpException('Ha ocurrido un error al guardar el usuario. Intentelo de nuevo o más tarde.',501)
        

        if(!newCli.activated)await this.emailService.sendEmail(email,newClient.activation_token);
        console.log(newClient)
        return newClient;
        } catch (error) {
            console.log(error)
            throw new HttpException(error,405)
        }

    }

    async activateClient({email, token}:{email: string, token: number}){
        console.log(email)        
        const cli= await this.clienteRepository.findOne({where: {email: email, activation_token: token}});
        console.log(cli)
        if(!cli) throw new HttpException('El token es invalido, intentalo de nuevo.', 404);

        cli.activated=true;
        cli.activation_token=null;
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
    async checkEmail({email}:{email:string}){
        console.log(email)
        const cli= await this.clienteRepository.findOne({where: {email}});
        console.log(cli)
        if(cli){
            return true
        }else{
            return false
        }
    }

    async resendToken({email}:{email:string}){
        const cli= await this.clienteRepository.findOne({where: {email}});
        console.log(cli)
        await this.emailService.sendEmail(email,cli.activation_token);
        if(cli){
            return true
        }else{
            return false
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
