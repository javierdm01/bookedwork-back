/* eslint-disable prettier/prettier */
import { Negocio } from "src/negocios/entities/negocio.entity";
import { Profesional } from "src/profesionales/entities/profesionales.entity";
import { Reserva } from "src/reservas/entities/reserva.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({type: 'int', nullable: false})
    duracion: number;

    @Column({type: 'varchar', length: 50, nullable: false})
    etiquetas: Array<string>; 

    @OneToMany(() => Reserva, reserva => reserva.id_reserva)
    reservas: Reserva[];

    @OneToMany(()=> Negocio, negocio => negocio.servicios)
    negocios: Negocio;
    
    @ManyToMany(()=> Profesional, profesional => profesional.servicios)
    @JoinTable({
        name: 'profesional_servicio',
        joinColumn: {name: 'id_servicio', referencedColumnName: 'id_servicio'},
        inverseJoinColumn: {name: 'id_profesional', referencedColumnName: 'id_profesional'}
    })
    profesionales: Profesional[];
     
}
