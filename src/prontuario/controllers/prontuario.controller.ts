import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProntuarioService } from '../services/prontuario.service';
import Prontuario from '../entities/prontuario.entity';

@ApiTags('Prontuário')
@UseGuards(JwtAuthGuard)
@Controller('/pacientes')
@ApiBearerAuth("access-token")
export class ProntuarioController {
  constructor(private readonly prontuarioService: ProntuarioService) {}

  // GET /pacientes/:id/prontuario
  @Get('/:id/prontuario')
  @HttpCode(HttpStatus.OK)
  buscarPorPaciente(@Param('id', ParseIntPipe) id: number) {
    return this.prontuarioService.buscarPorPaciente(id);
  }

  @Get('/prontuarios/buscar/:nome')
  @HttpCode(HttpStatus.OK)
  buscarPorNomePaciente(@Param('nome') nome: string): Promise<Prontuario[]> {
    return this.prontuarioService.buscarPorNomePaciente(nome);
  }

  // PUT /pacientes/:id/prontuario
  @Put('/:id/prontuario')
  @HttpCode(HttpStatus.OK)
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: Partial<Prontuario>,
  ): Promise<Prontuario> {
    return this.prontuarioService.atualizar(id, dados);
  }
}
