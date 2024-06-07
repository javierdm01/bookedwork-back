/* eslint-disable prettier/prettier */

import { Cliente } from "src/clientes/entities/cliente.entity";
import { Profesional } from "src/profesionales/entities/profesionales.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_reserva'})
    id_reserva: number;

    @Column({type: 'varchar', unique:true, nullable: false})
    token:string;

    @Column({type: 'timestamp', nullable: false})
    fechaReserva: Date;

    @Column({type: 'timestamp', nullable: false})
    fechaServicio: Date;

    @Column({type: 'varchar',default:'Activa',length:15, nullable: false})
    estado: string;

    @Column({type: 'float', nullable: false})
    coste: number;

    @Column({type: 'int', nullable: true})
    valoracion: number;

    @Column({type: 'varchar',length:255, nullable: true})
    comentario: string;

    @Column({type: 'varchar',length:255, nullable: true})
    titulo: string;
    //Relaciones  

    @ManyToOne(() => Cliente, cliente => cliente.reservas)
    @JoinColumn({ name: 'cliente_id' })
    cliente: Cliente;

    @ManyToOne(() => Servicio, servicio => servicio.reservas)
    @JoinColumn({ name: 'servicio_id' })
    servicio: Servicio;

    @ManyToOne(()=> Profesional, profesional => profesional.reservas)
    @JoinColumn({ name: 'profesional_id' })
    profesional: Profesional;


    
    

    
}
