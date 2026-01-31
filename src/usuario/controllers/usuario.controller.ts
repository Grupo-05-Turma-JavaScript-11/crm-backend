import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Usuario, UsuarioTipo } from '../entities/usuario.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../decorator/roles.decorator';

@ApiTags('Usuario')
@Controller('/usuarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UsuarioTipo.ADMIN, UsuarioTipo.MEDICO)
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  @Post('/cadastrar')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.create(usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Adicione o RolesGuard aqui
  @Roles(UsuarioTipo.ADMIN)
  @Put('/atualizar')
  @HttpCode(HttpStatus.OK)
  async update(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.update(usuario);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UsuarioTipo.ADMIN)
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any // Injetar o request para saber quem está deletando
  ): Promise<void> {
    await this.usuarioService.delete(id, req.user.id);
  }

  // Login público
  @Post('/logar')
  @HttpCode(HttpStatus.OK)
  async logar(@Body() body: any) {
    const { email, senha } = body || {};
    if (!email || !senha) {
      throw new BadRequestException(
        'Campos "email" e "senha" são obrigatórios',
      );
    }

    return this.usuarioService.logar(email, senha);
  }
}
