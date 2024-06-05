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
    @MaxLength(14)
    telefono: string;


    activated?:boolean;
    avatar?:string;


    

}