/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";
import { Cliente } from "src/clientes/entities/cliente.entity";


export class CreateConexioneDto {
    
    
    cliente: Cliente;

    @IsString()
    ip:string
}
