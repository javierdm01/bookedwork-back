/* eslint-disable prettier/prettier */


export interface NegocioInterface{
    id_negocio: number;
    email: string;
    nombre: string;
    telefono: string;
    direccion: string;
    contrasena: string;
    suscripcion: number;
    avatar: Express.Multer.File;
    imagenes: Array<Express.Multer.File>;
}