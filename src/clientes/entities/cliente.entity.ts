/* eslint-disable prettier/prettier */
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Cliente {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_cliente'})
    id_cliente: number;

    @Column({type: 'varchar', length: 30, nullable: false, name: 'nombre'})
    nombre: string;

    @Column({type: 'varchar', length: 50, nullable: false, name: 'apellidos'})
    apellidos: string;

    @Column({type: 'varchar', length: 50, nullable: false, name: 'email'})
    email: string;

    @Column({type: 'varchar', length: 11, nullable: false, name: 'telefono'})
    telefono: string;

    @Column({type: 'varchar', length: 255, nullable: false, name: 'direccion'})
    direccion: string;

    @Column({type: 'varchar', length: 16, nullable: false, name: 'contrasena'})
    contrasena: string;

    @Column({type: 'date', nullable: false, name: 'fecha_nacimiento'})
    fecha_nacimiento: Date;

    @Column({type: 'varchar', length: 255, nullable: true, name: 'avatar'})
    avatar: string;

    @Column({type: 'int', nullable: false,default:0, name: 'rol'})
    rol: number;

}
