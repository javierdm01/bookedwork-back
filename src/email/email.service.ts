/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
    private transporter;
    constructor(
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,
    ){
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
    }

    async sendEmail(email: string, activationToken: number) {
        if(activationToken === undefined) activationToken= (await this.clienteRepository.findOne({ where: { email } })).activation_token;
    
    
        try {
        await this.transporter.sendMail({
            from: 'dltcode260@gmail.com',
            to:email,
            subject: "Bienvenido a BookedWork",
            html: `<h1>Hola, bienvenido a BookedWork</h1>
            <p>Gracias por unirte a nuestro equipo, pero aún queda un paso, necesitamos comprobar que eres tu 
            para proteger todos tus datos.
            Porfavor introduzca este código de activacion en la ventana de verificación: </p>
            
            <b>${activationToken}</b> // html body

            <p>Si no has solicitado este correo, porfavor ignoralo</p>`,
        });
        return true
        } catch (error) {
        throw new Error('Error sending verification email');

        }
    }
}
