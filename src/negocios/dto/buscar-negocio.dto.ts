/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";


export class BuscarNegocioDto {

    @IsString()
    nombre: string;

    direccion: object;

    
}
