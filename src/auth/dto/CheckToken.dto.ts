/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";

export class CheckTokenDto {
    
    @IsString()
    token: string;

}