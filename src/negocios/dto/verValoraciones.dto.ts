/* eslint-disable prettier/prettier */
import { IsJSON, IsString } from "class-validator";


export class VerValoracionesDto {
    @IsString()
    email:string
    
}
