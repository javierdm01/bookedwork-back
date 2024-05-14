/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";


export class CreateNegocioDto {

    @IsString()
    nombre: string;

    @IsString()
    email: string;
    
    @IsString()
    telefono: string;

    @IsString()
    direccion: string;

    @IsString()
    contrasena: string;

    @IsString()
    avatar?:string;
    
}
