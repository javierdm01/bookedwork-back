/* eslint-disable prettier/prettier */
export class CreateProfesionaleDto {
    DNI: string;
    experiencia: number;
    valoracion: number;
    rol: number;
    especialidad: string;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion: string;
    contrasena: string;
    fecha_nacimiento: Date;
    avatar: Array<Express.Multer.File>;
    activated: boolean;
    activation_token: number;
}
