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
            to: email,
            subject: "Bienvenido a BookedWork",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
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

    async sendEmailValoraciones(email: string, nombreCliente:string, nombreNegocio:string, urlValoracion:string){
        try {
            await this.transporter.sendMail({
                from: 'info@bookedWork.com',
                to:email,
                subject: "Bienvenido a BookedWork",
                html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Valora tu experiencia</title>
                    <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #4CAF50;
                            color: #ffffff;
                            text-align: center;
                            padding: 10px 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .button {
                            background-color: #4CAF50;
                            color: #ffffff;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px 0;
                            color: #777777;
                            font-size: 12px;
                        }
                        .flex{
                            display: flex;
                            justify-content: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Dejanos Tu Valoracion</h1>
                        </div>
                        <div class="content">
                            <h2>¡Nos gustaría saber tu opinión!</h2>
                            <p>Hola ${nombreCliente},</p>
                            <p>Gracias por utilizar nuestros servicios. Nos encantaría saber cómo fue tu experiencia en ${nombreNegocio}.</p>
                            <p>Nos gustaría saber todo, tanto de los trabajadores como del negocio. 😉</p>
                            <p>Por favor, tómate un momento para valorar nuestro servicio haciendo clic en el botón de abajo:</p>
                            <div class="flex">
                                <a href="http://localhost:3000/valoraciones/${urlValoracion}?val=1" class="button"><i class="fa-regular fa-star"></i></a>
                                <a href="http://localhost:3000/valoraciones/${urlValoracion}?val=2" class="button"><i class="fa-regular fa-star"></i></a>
                                <a href="http://localhost:3000/valoraciones/${urlValoracion}?val=3" class="button"><i class="fa-regular fa-star"></i></a>
                                <a href="http://localhost:3000/valoraciones/${urlValoracion}?val=4" class="button"><i class="fa-regular fa-star"></i></a>
                                <a href="http://localhost:3000/valoraciones/${urlValoracion}?val=5" class="button"><i class="fa-regular fa-star"></i></a>
                            </div>
                            </p>
                            <p>¡Gracias por tu tiempo y esperamos verte pronto!</p>
                        </div>
                        <div class="footer">
                            <p>Booked Work | Todos los derechos reservados</p>
                        </div>
                    </div>
                </body>
                </html>`
                
            });
            return true
            } catch (error) {
            throw new Error('Error sending verification email'+error);
    
            }
    }

    async sendEmailReserva(email: string, nombreCliente: string, nombreNegocio: string, fecha: Date) {
        try {
            const fechaServicio = new Date(fecha);
            const dia = fechaServicio.getDate();
            const mes = fechaServicio.getMonth() + 1; // Los meses en JavaScript son 0-indexed.
            const anio = fechaServicio.getFullYear();
            const hora = fechaServicio.getHours();
            const minutos = fechaServicio.getMinutes();
    
            await this.transporter.sendMail({
                from: 'info@bookedWork.com',
                to: email,
                subject: "Gracias por tu reserva",
                html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Valora tu experiencia</title>
                    <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #4CAF50;
                            color: #ffffff;
                            text-align: center;
                            padding: 10px 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .button {
                            background-color: #4CAF50;
                            color: #ffffff;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px 0;
                            color: #777777;
                            font-size: 12px;
                        }
                        .flex {
                            display: flex;
                            justify-content: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Gracias Por Tu Reserva</h1>
                        </div>
                        <div class="content">
                            <h2>Queríamos agradecerte por reservar un servicio con nosotros</h2>
                            <p>Hola ${nombreCliente},</p>
                            <p>Gracias por utilizar nuestros servicios.</p>
                            <p>Queremos recordarte que has reservado tu servicio con ${nombreNegocio}.</p>
                            <p>La fecha para la realización de la actividad es el día <b>${dia}</b> de <b>${mes}</b> de <b>${anio}</b>.</p>
                            <p>La hora escogida para la realización del mismo es: ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}.</p>
                            <p>Esperamos que disfrutes de tu experiencia y que nos des tu opinión sobre la misma.</p>
                            <p>¡Gracias por tu tiempo y esperamos verte pronto!</p>
                        </div>
                        <div class="footer">
                            <p>Booked Work | Todos los derechos reservados</p>
                        </div>
                    </div>
                </body>
                </html>`
            });
            return true;
        } catch (error) {
            throw new Error('Error sending reservation email: ' + error.message);
        }
    }
    

    async sendEmailCancelacion(email: string, nombreCliente:string, nombreNegocio:string, fecha:Date){
        try {
            await this.transporter.sendMail({
                from: 'info@bookedWork.com',
                to:email,
                subject: "Cancelación de reserva",
                html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cancelación de reserva</title>
                    <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #4CAF50;
                            color: #ffffff;
                            text-align: center;
                            padding: 10px 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .button {
                            background-color: #4CAF50;
                            color: #ffffff;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px 0;
                            color: #777777;
                            font-size: 12px;
                        }
                        .flex{
                            display: flex;
                            justify-content: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Cancelación de Reserva</h1>
                        </div>
                        <div class="content">
                            <h2>Hola ${nombreCliente},</h2>
                            <p>Gracias por utilizar nuestros servicios.</p>
                            <p>Queremos recordarte,que tu cancelacion de la reserva de tu servicio con ${nombreNegocio} se ha cancelado.</p>
                            <p>La fecha de la actividad del día <b>${fecha.getTime()}</b> ${fecha.getMonth()+1} de ${fecha.getFullYear()}, ha sido cancelada correctamente </p>
                            <p>Esperamos que vuelvas a confiar en nosotros pronto.</p>
                            </p>
                            <p>¡Gracias por tu tiempo y esperamos verte pronto!</p>
                        </div>
                        <div class="footer">
                            <p>Booked Work | Todos los derechos reservados</p>
                        </div>
                    </div>
                </body>
                </html>`
                
            });
            return true
            } catch (error) {
            throw new Error('Error sending verification email'+error);
    
            }

    }
}
