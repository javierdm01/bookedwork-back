/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Injectable()
export class AuthService {
    constructor(){

    }

    async validateUser(email: string, contrasena: string): Promise<Cliente> {
        
        
    }
}
