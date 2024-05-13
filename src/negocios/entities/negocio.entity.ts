/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Negocio {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_negocio'})
    id_negocio: number;

    @Column({type: 'varchar', length: 50, unique: true, nullable: false})
    email: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    nombre: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    telefono: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    direccion: string;

    @Column({type: 'varchar', length: 16, nullable: false})
    contrasena: string;

    @Column({type: 'int', nullable: false})
    suscripcion: number;

    @Column({type: 'varchar', length: 50, nullable: false})
    avatar: string; 

    @Column({type: 'varchar', length: 50, nullable: false})
    imagenes: Array<string>;

    
}
