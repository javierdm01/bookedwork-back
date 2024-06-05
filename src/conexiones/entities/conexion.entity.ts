/* eslint-disable prettier/prettier */
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conexion {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_conexion'})
    id_conexion: number;

    //Relacion con la tabla cliente
    @ManyToOne(() => Cliente, cliente => cliente.id_cliente)
    cliente: Cliente;

    @Column({type: 'varchar', length: 17, nullable: false, name: 'ip'})
    ip: string;

    @Column({type:'date', nullable: false, name: 'fecha_inicio'})
    fecha_inicio: Date;

    @Column({type:'timestamp' })
    fechaExpiracion: Date;
}
 