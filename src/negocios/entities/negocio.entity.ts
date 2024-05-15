/* eslint-disable prettier/prettier */
import { Ofrecen } from "src/ofrecen/entities/ofrecen.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Negocio {
    @PrimaryGeneratedColumn({type: 'int',primaryKeyConstraintName: 'id_negocio'})
    id_negocio: number;

    @Column({type: 'varchar', length: 50, unique: true, nullable: false})
    email: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    nombre: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    telefono: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    direccion: string;

    @Column({type: 'varchar', length: 16, nullable: false})
    contrasena: string;

    @Column({type: 'int', nullable: false})
    suscripcion: number;

    @Column({type: 'varchar', length: 50, nullable: false})
    avatar: Express.Multer.File; 

    @Column({type: 'varchar', length: 50, nullable: false})
    imagenes: Array<Express.Multer.File>;

    @OneToMany(()=> Ofrecen, ofrecen => ofrecen.negocio)
    servicios: Ofrecen[];
    
    
}
