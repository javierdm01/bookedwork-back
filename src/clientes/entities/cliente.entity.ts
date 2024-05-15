/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cli } from "../cliente.interface";
import { Persona } from "src/person/entities/person.entity";
import { Reserva } from "src/reservas/entities/reserva.entity";

@Entity()
export class Cliente extends Persona implements Cli{
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_cliente'})
    id_cliente: number;

    @Column({type: 'int', nullable: false,default:0, name: 'rol'})
    rol: number;
    
    @OneToMany(() => Reserva, reserva => reserva.cliente)
    reservas: Reserva[];

}
  