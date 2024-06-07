/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from "class-validator";


export class resetPasswordDto {
    token: number;

    contrasena:string;
}