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
    
        const senhaValida = await this.bcrypt.compararSenhas(
            usuarioLogin.senha,
            buscaUsuario.senha
        );
    
        if (!senhaValida) {
            throw new HttpException('Email ou senha inválidos!', HttpStatus.UNAUTHORIZED);
        }
    
        const payload = { 
            sub: buscaUsuario.email,
            id: buscaUsuario.id,
            tipo: buscaUsuario.tipo
        };
    
        return {
            usuario: {
                id: buscaUsuario.id,
                nome: buscaUsuario.nome,
                email: buscaUsuario.email,
                tipo: buscaUsuario.tipo,
                foto: buscaUsuario.foto,
            },
            token: this.jwtService.sign(payload),
        };
    }
    
}
