/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { LoginAuthDto } from "./LoginAuth.dto";


export class RegisterAuthDto extends LoginAuthDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(11)
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    direccion: string;

    @IsNotEmpty()
    fecha_nacimiento: Date;

    

}