/* eslint-disable prettier/prettier */

import { Cliente } from "src/clientes/entities/cliente.entity";
import { Profesional } from "src/profesionales/entities/profesionale.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_reserva'})
    id_reserva: number;

    @Column({type: 'date', nullable: false})
    fechaReserva: Date;

    @Column({type: 'date', nullable: false})
    fechaServicio: Date;

    @Column({type: 'string', nullable: false})
    estado: string;

    @Column({type: 'float', nullable: false})
    coste: number;

    @Column({type: 'string', nullable: false})
    valoracion: string;

    @Column({type: 'string', nullable: false})
    comentario: string;

    //Relaciones 

    @ManyToOne(() => Cliente, cliente => cliente.id_cliente)
    cliente: Cliente;

    @ManyToOne(() => Servicio, servicio => servicio.id_servicio)
    servicio: Servicio;

    @ManyToOne(()=> Profesional, profesional => profesional.id_profesional)
    profesional: Profesional;

    
    

    
}
