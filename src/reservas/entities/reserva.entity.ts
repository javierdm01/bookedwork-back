/* eslint-disable prettier/prettier */

import { Cliente } from "src/clientes/entities/cliente.entity";
import { Profesional } from "src/profesionales/entities/profesionales.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_reserva'})
    id_reserva: number;

    @Column({type: 'varchar', unique:true, nullable: false})
    token:string;

    @Column({type: 'date', nullable: false})
    fechaReserva: Date;

    @Column({type: 'date', nullable: false})
    fechaServicio: Date;

    @Column({type: 'varchar',default:'Activa',length:15, nullable: false})
    estado: string;

    @Column({type: 'float', nullable: false})
    coste: number;

    @Column({type: 'int', nullable: true})
    valoracion: number;

    @Column({type: 'varchar',length:50, nullable: true})
    comentario: string;

    //Relaciones 

    @ManyToOne(() => Cliente, cliente => cliente.id_cliente)
    cliente: Cliente;

    @ManyToOne(() => Servicio, servicio => servicio.id_servicio)
    servicio: Servicio;

    @ManyToOne(()=> Profesional, profesional => profesional.id_profesional)
    profesional: Profesional;

    
    

    
}
