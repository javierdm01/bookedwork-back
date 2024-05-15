/* eslint-disable prettier/prettier */
import { Negocio } from "src/negocios/entities/negocio.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity()
export class Ofrecen{
    @ManyToOne(() => Negocio, negocio => negocio.id_negocio)
    negocio: Negocio;

    @ManyToOne(() => Servicio, servicio => servicio.id_servicio)
    servicio: Servicio;
    
}