/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto  {
    nombre?:string;
    apellidos?:string;
    email?:string;
    telefono?:string;
    fechaNacimiento?:string;
    avatar?: Express.Multer.File;
    direccion?:{
        calle?:string;
        ciudad?:string;
    }
}
