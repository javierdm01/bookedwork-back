/* eslint-disable prettier/prettier */
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class Conexion {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_conexion'})
    id_conexion: number;

    //Relacion con la tabla cliente
    @OneToMany(() => Cliente, cliente => cliente.id_cliente)
    id_cliente: number;

    @Column({type: 'varchar', length: 255, nullable: false, name: 'ip'})
    ip: string;

    @Column({type:'datetime', nullable: false, name: 'fecha_inicio'})
    fecha_inicio: Date;

}
