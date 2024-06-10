/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from "class-validator";


export class ForggetPasswordDto {
    @IsEmail()
    email: string;


}