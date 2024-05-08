/* eslint-disable prettier/prettier */


export interface Cliente{
    id_cliente: number;
    email: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    direccion: string;
    contrasena: string;
    fecha_nacimiento: Date;
    rol: number;
    avatar: string;
}