/* eslint-disable prettier/prettier */
import { Reserva } from "src/reservas/entities/reserva.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Servicio {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_servicio'})
    id_servicio: number;

    @Column({type: 'float', nullable: false})
    coste: number;

    @Column({type: 'varchar', length: 50,unique: true, nullable: false})
    nombre: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    descripcion: string;

    @Column({type: 'varchar', length: 10, nullable: false})
    duracion: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    etiquetas: Array<string>;

    @OneToMany(() => Reserva, reserva => reserva.id_reserva)
    reservas: Reserva[];

    
}
