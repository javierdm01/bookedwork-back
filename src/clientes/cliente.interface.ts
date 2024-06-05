/* eslint-disable prettier/prettier */


export interface Cli{
    id_cliente: number;
    email: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    direccion: Object;
    contrasena: string;
    fecha_nacimiento?: Date;
    rol: number;
    avatar?: string;
}