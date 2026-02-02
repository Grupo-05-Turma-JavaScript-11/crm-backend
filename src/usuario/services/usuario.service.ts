import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt'; // ✅ caminho conforme você mostrou
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
    return await this.usuarioRepository.findOne({ 
      where: { email },
      select: ['id', 'nome', 'email', 'senha', 'tipo', 'foto'] // Força a busca da senha aqui
    });
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

    usuario.tipo = usuario.tipo;

    // hash da senha antes de salvar
    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);

    const salvo = await this.usuarioRepository.save(usuario);

    // por segurança, não retorne o hash
    const { senha, ...safe } = salvo as any;
    return safe;
  }

  async update(usuario: Usuario, usuarioLogado: Usuario): Promise<Usuario> {
    // Busca os dados atuais do usuário que será editado
    const buscarUsuario = await this.findById(usuario.id);
  
    // REGRA DE SEGURANÇA:
    // Se quem está logado NÃO for ADMIN e tentar mudar o 'tipo', barramos.
    if (usuario.tipo && usuario.tipo !== buscarUsuario.tipo && usuarioLogado.tipo !== "ADMIN") {
      throw new HttpException(
        "Você não tem permissão para alterar o nível de acesso (tipo).", 
        HttpStatus.FORBIDDEN
      );
    }
  
    // REGRA DE SEGURANÇA:
    // Se quem está logado NÃO for ADMIN e tentar editar OUTRO usuário, barramos.
    if (usuarioLogado.tipo !== "ADMIN" && usuarioLogado.id !== usuario.id) {
      throw new HttpException(
        "Você só pode atualizar o seu próprio perfil.", 
        HttpStatus.FORBIDDEN
      );
    }
  
    // Tratamento da Senha
    if (usuario.senha) {
      usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    } else {
      usuario.senha = buscarUsuario.senha;
    }
  
    const salvo = await this.usuarioRepository.save(usuario);
  
    const { senha, ...safe } = salvo as any;
    return safe;
  }

  async delete(idParaDeletar: number, usuarioLogado: Usuario): Promise<void> {
    // Regra de Ouro: Apenas ADMIN pode deletar
    if (usuarioLogado.tipo !== "ADMIN") {
      throw new UnauthorizedException("Apenas administradores podem realizar esta operação.");
    }
  
    // Regra extra: Um admin não pode se auto-excluir
    if (idParaDeletar === usuarioLogado.id) {
      throw new BadRequestException("Um administrador não pode excluir a própria conta.");
    }
  
    const usuario = await this.findById(idParaDeletar);
    await this.usuarioRepository.remove(usuario);
  }

}