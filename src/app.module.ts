/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConexionesModule } from './conexiones/conexiones.module';
import { EmailModule } from './email/email.module';
import { ClientesModule } from './clientes/clientes.module';
import { Cliente } from './clientes/entities/cliente.entity';
import { S3Module } from './s3/s3.module';
import { NegociosModule } from './negocios/negocios.module';
import { ReservasModule } from './reservas/reservas.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
  }),
  TypeOrmModule.forFeature([
    Cliente,
  ]),
    AuthModule,
    ConexionesModule,
    EmailModule,
    ClientesModule,
    S3Module,
    NegociosModule,
    ReservasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}