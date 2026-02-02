import {
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
import { Usuario } from '../entities/usuario.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';


@ApiTags('Usuario')
@Controller('/usuarios')
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard) // Obrigatório para o req.user funcionar
  @Put('/atualizar')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() usuario: Usuario, 
    @Request() req: any
  ): Promise<Usuario> {
    // Passamos o corpo (usuario) e quem está logado (req.user)
    return this.usuarioService.update(usuario, req.user);
  }

  @UseGuards(JwtAuthGuard) // Aqui não precisa do RolesGuard, o Service resolve
  @Delete("/:id")
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any 
  ): Promise<void> {
    // Passamos o usuário inteiro (ou só o tipo) para o service
    await this.usuarioService.delete(id, req.user);
  }

}
