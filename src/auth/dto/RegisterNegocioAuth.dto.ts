/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class RegisterNegocioAuthDto{
    @IsString()
    @IsNotEmpty()
    cif: string;

    @IsString()
    @IsNotEmpty()
    categoria:string;

    @IsNumber()
    @IsNotEmpty()
    valoracion:number;
    
    imagenes:Array<string>;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    contrasena: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;

    @IsNotEmpty()
    @IsObject()
    direccion:{
        calle:string;
        cidudad:string;
        pais:string;
    }

    @IsNotEmpty()
    @IsString()
    descripcion: string;


}