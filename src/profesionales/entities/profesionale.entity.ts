/* eslint-disable prettier/prettier */

import { Persona } from "src/person/entities/person.entity";
import { Reserva } from "src/reservas/entities/reserva.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profesional extends Persona {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_profesional'})
    id_profesional: number;

    @Column({type: 'varchar',length:9, nullable: false})
    DNI: string;

    @Column({type: 'int', nullable: false})
    experiencia: number;

    @Column({type: 'float', nullable: false})
    valoracion: number;

    @Column({type: 'int', nullable: false})
    rol: number;

    @Column({type: 'varchar', nullable: false})
    especialidad: string;

    //Relaciones
    @OneToMany(() => Reserva, reserva => reserva.profesional)
    reservas: Reserva[];
    

    
}
