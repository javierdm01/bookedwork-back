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
import { ForggetPasswordDto } from './dto/ForggetPassword.dto';
import { resetPasswordDto } from './dto/ResetPassword.dto';
import { Profesional } from 'src/profesionales/entities/profesionales.entity';

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
        
        @InjectRepository(Profesional)
        private profesionalRepository: Repository<Profesional>
    ){
    }

    async loginClient(clientDto: LoginAuthDto) {
        try {
            const {email, contrasena} = clientDto;
        const cli= await this.clienteRepository.findOne({where: {email}});
        const neg= await this.negocioRepository.findOne({where: {email}})
        const prof= await this.profesionalRepository.findOne({where:{email}})
        //Comprobacion de que el cliente existe
        if (!cli && !neg && !prof){
            throw new HttpException('Correo o contraseña invalida', 404);
        } 
        
        if(cli){
            
        const isPasswordValid= await compare(contrasena, cli.contrasena,)

        if (!isPasswordValid) throw new HttpException('Correo o contraseña invalida', 404);
        if(!cli.activated) throw new HttpException('La cuenta no está activada', 404);

        //Obtengo el token
        const token= this.jwtService.sign({id: cli.id_cliente, email: cli.email});
        //Obtengo la IP del cliente
        const ip= await this.getIp()


        //Guardamos la conexion
        const conexion=await this.conexionesService.createNewConexiones({ip, cliente: cli});
        if(!conexion) throw new HttpException('IP Desconocida', 409);
        await this.emailService.ipLocation(cli.email,`http://localhost:3000/conexiones/${token}`);
        //Retornamos el cliente y el token
        return {cli, token};
        }else if(neg){
            
        const isPasswordValid= await compare(contrasena, neg.contrasena,)

        if (!isPasswordValid) throw new HttpException('Correo o contraseña invalida', 404);

        if(!neg.activated) throw new HttpException('La cuenta no está activada', 404);

        //Obtengo el token
        const token= this.jwtService.sign({id: neg.id_negocio, email: neg.email});
         (token) 
        //Obtengo la IP del cliente
        

        //Retornamos el cliente y el token
        return {neg, token};
        }else{
            const isPasswordValid= await compare(contrasena, prof.contrasena,)

        if (!isPasswordValid) throw new HttpException('Correo o contraseña invalida', 404);


        //Obtengo el token
        const token= this.jwtService.sign({id: prof.id_profesional, email: prof.email});
         (token) 

        //Guardamos la conexion

        //Retornamos el cliente y el token
        return {prof, token};
        }
        } catch (error) {
             (error)
            return error
        }

    }

    async registerClient(clientDto: RegisterAuthDto){
        try {
            
            const {email,contrasena,fechaNacimiento,direccion} = clientDto;
             const dir= {
                calle:direccion.calle,
                ciudad:direccion.ciudad,
                pais:'España'
             }
            const telf=clientDto.telefono.trim()
            const cli= await this.clienteRepository.findOne({where: [{email},{telefono:telf}]});

        //Si el cliente ya existe lanzamos un error
        if(cli) throw new HttpException('Ya hay un cliente asociado al correo o al número de teléfono.', 409);
             console.log(clientDto)
        //Creamos el nuevo cliente y lo guardamos
        const hasedPassword=contrasena ?await hash(contrasena, 10):''
        const newClient=await  this.clienteRepository.create({
            ...clientDto,
            telefono:telf,
            contrasena: hasedPassword,
            fecha_nacimiento:new Date(fechaNacimiento),
            direccion:dir
        });
        const newCli=await this.clienteRepository.save(newClient);
        if(!newCli) throw new HttpException('Ha ocurrido un error al guardar el usuario. Intentelo de nuevo o más tarde.',501)
        

        if(!newCli.activated) await this.emailService.sendEmail(email,newClient.activation_token);
        return newCli;
        } catch (error) {
            throw new HttpException(error,405)
        }

    }

    async activateClient({email, token}:{email: string, token: number}){      
        const cli= await this.clienteRepository.findOne({where: {email: email, activation_token: token}});
        const neg= await this.negocioRepository.findOne({where: {activation_token: token, email: email}})
        if(!cli && !neg) throw new HttpException('El token es invalido, intentalo de nuevo.', 404);
        if(cli){
            cli.activated=true;
            await this.clienteRepository.save(cli);
    
            return cli;
        }else{
            neg.activated=true
            await this.negocioRepository.save(neg)
            return neg
        }
        
    }

    async checkToken(token:number): Promise<any>{
        try {
            const cli= await this.clienteRepository.findOne({where: {activation_token: token}});
            if(!cli) throw new HttpException('Client not found', 404);
            return cli
        } catch (error) {
            throw new HttpException('Error Verification Token'+error, 404);
        }
    }
    async checkEmail({email}:{email:string}){
        const cli= await this.clienteRepository.findOne({where: {email}});
        const neg= await this.negocioRepository.findOne({where: {email}});
        if(cli || neg){
            return true
        }else{
            return false
        }
    }

    async resendToken({email}:{email:string}){
        const cli= await this.clienteRepository.findOne({where: {email}});
        await this.emailService.sendEmail(email,cli.activation_token);
        if(cli){
            return true
        }else{
            return false
        }
    }
    async forggetPassword(email:object){
        const correo=email['email'].trim()

        try {
            const cli= await this.clienteRepository.findOne({where: {email:correo}});
            if(!cli) throw new HttpException('Client not found', 404);
            if(!cli.activated) throw new HttpException('La cuenta no está activada', 404);
            await this.emailService.forgottenPassword(cli.email,`http://localhost:3000/auth/resetPassword?ecode=${cli.activation_token}`);
            return true;
        } catch (error) {
             (error)
            return error;
        }
    }
    async resetPassword(resetPassword:resetPasswordDto){
        const {token, contrasena}=resetPassword
        try {
            const cli= await this.checkToken(token)
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

    async registerNegocio(negocioDto: RegisterNegocioAuthDto){
            const {email,nombre,contrasena,cif,direccion} = negocioDto;
            try {
                const neg= await this.negocioRepository.findOne({where:[
                    {email},
                    {nombre},
                    {CIF:cif}
                ] });
                const dir={
                    calle: direccion.calle,
                    ciudad:direccion.ciudad,
                    pais:'España'
                }
                //Si el negocio ya existe lanzamos un error
                if (neg) throw new HttpException('El negocio ya existe', 409);
                //Creamos el nuevo negocio y lo guardamos
                const newNegocio = this.negocioRepository.create({
                    ...negocioDto,
                    CIF:negocioDto.cif,
                    contrasena: await hash(contrasena, 10),
                    activated:true,
                    direccion:dir
                });
                await this.negocioRepository.save(newNegocio);
    
                await this.emailService.sendMailNegocio(email, newNegocio.activation_token);
                console.log(newNegocio)
                return newNegocio;
            } catch (error) {
                console.log(error)
                return error
            }

    }
}
