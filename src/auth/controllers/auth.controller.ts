import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsuarioLogin } from './../entities/usuariologin.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuario')
@Controller('/usuarios')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/logar')
  async login(@Body() usuarioLogin: UsuarioLogin) {
    const usuarioValidado = await this.authService.validateUser(
      usuarioLogin.email,
      usuarioLogin.senha,
    );

    if (!usuarioValidado) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    return this.authService.login(usuarioLogin);
  }
}
