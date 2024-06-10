/* eslint-disable prettier/prettier */
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Negocio {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_negocio'})
    id_negocio: number;

    @Column({type: 'varchar', length: 9, unique: true, nullable: false})
    CIF: string;

    @Column({type: 'varchar', length: 50, unique: true, nullable: false})
    email: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    categoria: string;

    @Column({type: 'varchar', length: 50,unique:true, nullable: false})
    nombre: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    telefono: string;

    @Column({type: 'json', nullable: false})
    direccion: object;

    @Column({type: 'varchar', length: 255, nullable: false})
    contrasena: string;

    @Column({type: 'json', nullable: true})
    horario: object;

    @Column({type: 'int', nullable: false,default:0})
    suscripcion: number;

    @Column({type: 'varchar',array:true, nullable: true})
    imagenes: Array<string>;
 
    @Column({type: 'boolean', default: false}) 
    activated: boolean;

    @Column({type: 'int',default: Math.floor(100000 + Math.random() * 900000), nullable: true})
    activation_token: number;

    @OneToMany(() => Servicio, servicio => servicio.negocios)
    servicios: Servicio[];
    
    @Column({type:'float',default:0,nullable:false})
    valoracion:number;
    
}
