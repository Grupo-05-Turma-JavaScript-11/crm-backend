import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt'; // ✅ caminho conforme você mostrou
import { UsuarioTipo } from '../enums/usuario-tipo.enum';
import { JwtService } from '@nestjs/jwt'; // ✅ para gerar token (opcional, mas recomendado)

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
    private jwt: JwtService, 
  ) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario)
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);

    return usuario;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const buscaUsuario = await this.findByEmail(usuario.email);

    if (buscaUsuario)
      throw new HttpException('O usuário já existe!', HttpStatus.BAD_REQUEST);

    usuario.tipo = usuario.tipo ?? UsuarioTipo.USUARIO;

    // hash da senha antes de salvar
    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);

    const salvo = await this.usuarioRepository.save(usuario);

    // por segurança, não retorne o hash
    const { senha, ...safe } = salvo as any;
    return safe;
  }

  async update(usuario: Usuario): Promise<Usuario> {
    await this.findById(usuario.id);

    const buscaUsuario = await this.findByEmail(usuario.email);

    if (buscaUsuario && buscaUsuario.id !== usuario.id) {
      throw new HttpException('Usuário (e-mail) já cadastrado!', HttpStatus.BAD_REQUEST);
    }

    usuario.tipo = usuario.tipo ?? UsuarioTipo.USUARIO;

    
    if (usuario.senha) {
      usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    } else {
      
      const atual = await this.findById(usuario.id);
      usuario.senha = atual.senha;
    }

    const salvo = await this.usuarioRepository.save(usuario);

    const { senha, ...safe } = salvo as any;
    return safe;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.usuarioRepository.delete(id);
  }

  // ✅ NOVO: método de login usado pelo controller
  async logar(email: string, senhaPlain: string) {
    const usuario = await this.findByEmail(email);

    // Não revelar qual parte falhou (boa prática)
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const ok = await this.bcrypt.compararSenhas(senhaPlain, usuario.senha);
    if (!ok) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // (Opcional) Gerar token JWT
    const token = this.jwt.sign(
      { sub: usuario.id, email: usuario.email, tipo: usuario.tipo },
      { expiresIn: '1h' },
    );

    // Retornar dados seguros
    return {
      message: 'Autenticado',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        foto: usuario.foto,
      },
       };
  }
}
