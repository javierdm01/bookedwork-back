/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";


export class BuscarNegocioDto {

    @IsString()
    categoria: string;

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
