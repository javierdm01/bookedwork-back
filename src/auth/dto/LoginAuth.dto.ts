/* eslint-disable prettier/prettier */
import { IsEmail, MaxLength, MinLength } from "class-validator";


export class LoginAuthDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    @MaxLength(16)
    contrasena: string;
}