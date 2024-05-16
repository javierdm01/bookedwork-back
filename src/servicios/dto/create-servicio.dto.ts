/* eslint-disable prettier/prettier */
import { IsDecimal, IsString } from "class-validator";


export class CreateServicioDto {

    @IsDecimal()
    coste: number;

    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    etiquetas: Array<string>;
 
    @IsDecimal()
    duracion: number;

    profesionales: Array<number>;

    negocio: number;

}
