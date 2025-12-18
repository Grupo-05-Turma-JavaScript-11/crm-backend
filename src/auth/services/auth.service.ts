import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private bcrypt: Bcrypt
    ) { }

    async validateUser(email: string, password: string): Promise<any> {

        const buscaUsuario = await this.usuarioService.findByEmail(email);

        if (!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        const matchPassword = await this.bcrypt.compararSenhas(
            password,
            buscaUsuario.senha
        );

        if (matchPassword) {
            const { senha, ...resposta } = buscaUsuario;
            return resposta;
        }

        return null;
    }

    async login(usuarioLogin: UsuarioLogin) {

        const buscaUsuario = await this.usuarioService.findByEmail(usuarioLogin.email);

        if (!buscaUsuario)
            throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

        const payload = { sub: buscaUsuario.email };

        return {
            id: buscaUsuario.id,
            nome: buscaUsuario.nome,
            email: buscaUsuario.email,
            foto: buscaUsuario.foto,
            token: `Bearer ${this.jwtService.sign(payload)}`,
        };
    }
}
