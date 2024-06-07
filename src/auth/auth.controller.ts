/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/RegisterAuth.dto';
import { LoginAuthDto } from './dto/LoginAuth.dto';
import { CheckTokenDto } from './dto/CheckToken.dto';
import { RegisterNegocioAuthDto } from './dto/RegisterNegocioAuth.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ForggetPasswordDto } from './dto/ForggetPassword.dto';
import { resetPasswordDto } from './dto/ResetPassword.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}


    @Post('register')
    registerUser(@Body() userObject: RegisterAuthDto){
        return this.authService.registerClient(userObject)
    }

    @Post('login')
    loginUser(@Body( ) userObjectLogin: LoginAuthDto){
        return this.authService.loginClient(userObjectLogin)
    }
    @Post('activate')
    activateUser(@Body() userObjectActivate: {email: string, token: number}){
        return this.authService.activateClient(userObjectActivate)
    }


    @Post('checkEmail')
    checkEmail(@Body() email){
        return this.authService.checkEmail(email)
    }

    @Post('resendToken')
    resendToken(@Body() email){
        return this.authService.resendToken(email)
    }
    @Post('registerNegocio')
    @UseInterceptors(FilesInterceptor('imagenes'))
    registerNegocio(@Body() negocioObject: RegisterNegocioAuthDto,@UploadedFiles() imagenes: Array<Express.Multer.File>){
        return this.authService.registerNegocio(negocioObject,imagenes)
    }

    @Post('forggetPassword')
    forggetPassword(@Body() email:object){
        return this.authService.forggetPassword(email)
    }

    @Post('checkToken')
    checkToken(@Body() token:object){
        return this.authService.checkToken(token['token'])
    }

    @Post('resetPassword')
    resetPassword(@Body() resetPassword:resetPasswordDto){
        return this.authService.resetPassword(resetPassword)
    }
}
