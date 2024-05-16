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
            from: 'info@bookedWork.com',
            to:email,
            subject: "Bienvenido a BookedWork",
            html: `<h1>Hola, bienvenido a BookedWork</h1>
            <p>Gracias por unirte a nuestro equipo, pero aún queda un paso, necesitamos comprobar que eres tu 
            para proteger todos tus datos.
            Porfavor introduzca este código de activacion en la ventana de verificación: </p>
            
            <b>${activationToken}</b>

            <p>Si no has solicitado este correo, porfavor ignoralo</p>`,
        });
        return true
        } catch (error) {
        throw new Error('Error sending verification email'+error);

        }
    }
    async forgottenPassword(email: string,url:string) {
    
        
        try {
        await this.transporter.sendMail({
            from: 'info@bookedWork.com',
            to:email,
            subject: "Bienvenido a BookedWork",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de contraseña</title>
            </head>
            <body>
                <p>Hola,</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
                <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                <a href="${ url }" target="_blank">Restablecer contraseña</a>
                <p>Si el enlace no funciona, copia y pega la siguiente URL en tu navegador:</p>
                <p>${ url }</p>
                <p>Gracias,</p>
                <p>Tu equipo de soporte</p>
            </body>
            </html>
            `,
        });
        return true
        } catch (error) {
        throw new Error('Error sending verification email'+error);

        }
    }
    async ipLocation(email: string,url:string) {
    
        
        try {
        await this.transporter.sendMail({
            from: 'info@bookedWork.com',
            to:email,
            subject: "Bienvenido a BookedWork",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Inicio de sesión</title>
            </head>
            <body>
                <p>Hola,</p>
                <p>Hemos detectado un inicio de sesión en tu cuenta desde una nueva ubicación.</p>
                <p>Si has sido tu, confirma el inicio de sesión.</p>
                <a href="${ url }" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Confirmar Inicio de Sesión</a>
                <p>Si no has sido tú quien ha iniciado sesión, te recomendamos cambiar tu contraseña de inmediato y revisar la seguridad de tu cuenta.</p>
                <p>También puedes revisar tu actividad reciente iniciando sesión en nuestra plataforma:</p>
                <p>Gracias,</p>
                <p>Tu equipo de seguridad</p>
            </body>
            </html>
            
            `,
        });
        return true
        } catch (error) {
        throw new Error('Error sending verification email'+error);

        }
    }

    async sendMailNegocio(email: string, activationToken: number){
        if(activationToken === undefined) activationToken= (await this.clienteRepository.findOne({ where: { email } })).activation_token;
        try {
            await this.transporter.sendMail({
                from: 'info@bookedWork.com',
                to:email,
                subject: "Bienvenido a BookedWork Negocios",
                html: `<h1>Hola, bienvenido a BookedWork Negocios</h1>
                <p>Es un placer darte las gracias por unirte a nosotros para dar a conocer tus servicios al mundo.</p>
                <p>Para proteger tus datos y los de tus clientes, necesitamos comprobar que eres tu,
                <p>Porfavor introduzca este código de activacion en la ventana de verificación: </p>
                
                <b>${activationToken}</b>

                <p>Si no has solicitado este correo, porfavor ignoralo</p>`,
            });
        return true
        } catch (error) {
        throw new Error('Error sending verification email'+error);

        }
    }
}
