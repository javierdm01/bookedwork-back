/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class RegisterNegocioAuthDto{
    CIF: string;

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
    direccion: {
        calle: string;
        numero: string;
        ciudad: string;
        codigo_postal: string;
    }
    
    @IsNotEmpty()
    @IsString()
    categoria: string;
    horario: {
        lunes: Array<string>;
        martes: Array<string>;
        miercoles: Array<string>;
        jueves: Array<string>;
        viernes: Array<string>;
        sabado: Array<string>;
        domingo: Array<string>;
    }
    @IsNotEmpty()
    @IsString()
    descripcion: string;


}