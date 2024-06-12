/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { LoginAuthDto } from "./LoginAuth.dto";


export class RegisterAuthDto extends LoginAuthDto {

    nombre: string;

    apellidos: string;

    telefono: string;

    direccion:{
        calle:string;
        ciudad:string;
    }
    
    fechaNacimiento:string;


    

}