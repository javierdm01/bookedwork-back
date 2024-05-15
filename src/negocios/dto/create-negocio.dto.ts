/* eslint-disable prettier/prettier */
import { IsJSON, IsString } from "class-validator";


export class CreateNegocioDto {

    @IsString()
    nombre: string;

    @IsString()
    email: string;
    
    @IsString()
    categoria: string;

    @IsString()
    telefono: string;

    @IsJSON()
    direccion: object;

    @IsString()
    contrasena: string;

    @IsString()
    avatar?:string;

    imagenes:Array<Express.Multer.File>;
    
}
