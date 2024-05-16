/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { AuthService } from './auth.service';
import { JwStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailController } from 'src/email/email.controller';
import { EmailService } from 'src/email/email.service';
import { Conexion } from 'src/conexiones/entities/conexion.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ConexionesService } from 'src/conexiones/conexiones.service';
import { Negocio } from 'src/negocios/entities/negocio.entity';
import { S3Service } from 'src/s3/s3.service';
@Module({
imports:[
    TypeOrmModule.forFeature([Cliente,Conexion,Negocio]),
    JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '300s'}
    }),

],
    controllers: [AuthController,EmailController],
    providers: [AuthService,JwStrategy,EmailService,ConexionesService,S3Service],

})
export class AuthModule {}