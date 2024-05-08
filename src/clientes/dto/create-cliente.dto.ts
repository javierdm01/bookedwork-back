/* eslint-disable prettier/prettier */
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateClienteDto {
    @IsEmail()  
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    contrasena: string;

    @IsDate()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @IsNumber()
    @IsNotEmpty()
    rol: number;

}
