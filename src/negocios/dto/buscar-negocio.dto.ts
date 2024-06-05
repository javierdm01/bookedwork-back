/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";


export class BuscarNegocioDto {

    @IsString()
    nombre: string;

    ubicacion: {
        calle?:string;
        ciudad?:string;
        otros?:string;
    };

    fecha: Date;

    horario:{
        inicio: string;
        fin:string;
    }
    
    
}
