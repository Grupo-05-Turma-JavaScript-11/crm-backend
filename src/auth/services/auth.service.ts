import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const buscaUsuario = await this.usuarioService.findByEmail(email);

    if (!buscaUsuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    const matchPassword = await this.bcrypt.compararSenhas(
      password,
      buscaUsuario.senha,
    );

    if (matchPassword) {
      const { senha, ...resposta } = buscaUsuario;
      return resposta;
    }

    return null;
  }

  async login(usuarioLogin: UsuarioLogin) {
    // Aqui criamos um objeto na qual terá um atributo chamado sub e recebe o email do corpo da requisição
    const payload = { sub: usuarioLogin.email }

    /*
        objeto que vem pelo corpo da requisição => usuarioLogin = { usuario: "email@email.com", senha: "12345678" }
        objeto criado => payload = { sub: "email@email.com"}
    */

    const buscaUsuario = await this.usuarioService.findByEmail(usuarioLogin.email)

    // Retorna um objeto com os dados do usuário caso o login for bem sucedido
    return {
        id: buscaUsuario?.id,   // Colocamos ? pois o buscaUsuario pode retornar nulo. Caso existir (?) tenta acessar o id
        nome: buscaUsuario?.nome,
        email: usuarioLogin.email,
        senha: '',
        tipo: buscaUsuario?.tipo,
        foto: buscaUsuario?.foto,
        token: `Bearer ${this.jwtService.sign(payload)}`,   // Cria o Token JWT, criptografando alguns dados como o email do usuário que acabou de logar
    }

}
}
