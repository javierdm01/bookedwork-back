/* eslint-disable prettier/prettier */
import { Column } from "typeorm";

export class Persona {

    @Column({type: 'varchar', length: 30, nullable: false, name: 'nombre'})
    nombre: string;

    @Column({type: 'varchar', length: 50, nullable: false, name: 'apellidos'})
    apellidos: string;

    @Column({type: 'varchar', length: 50, nullable: false, name: 'email',unique: true})
    email: string;

    @Column({type: 'varchar', length: 11, nullable: false, name: 'telefono'})
    telefono: string;

    @Column({type: 'varchar', length: 255, nullable: false, name: 'direccion'})
    direccion: string;

    @Column({type: 'varchar', length: 100 , nullable: false, name: 'contrasena'})
    contrasena: string;

    @Column({type: 'date', nullable: false, name: 'fecha_nacimiento'})
    fecha_nacimiento: Date;

    @Column({type: 'varchar', length: 255, nullable: true, name: 'avatar'})
    avatar: Express.Multer.File;

    //Activation Columns 
    @Column({type: 'boolean', default: false}) 
    activated: boolean;

    @Column({type: 'numeric',default: Math.floor(100000 + Math.random() * 900000), nullable: true})
    activation_token: number;
}
  