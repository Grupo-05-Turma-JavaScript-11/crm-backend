import { Controller, Post, Get, Body, HttpCode, HttpStatus, ParseIntPipe, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AtendimentoService } from '../services/atendimento.service';
import { Atendimento } from '../../atendimento/entities/atendimento.entity';
import { DeleteResult } from 'typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@ApiTags('Atendimento')
@UseGuards(JwtAuthGuard)
@Controller("/atendimentos")
@ApiBearerAuth()
export class AtendimentoController {
  constructor(private readonly atendimentoService: AtendimentoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Atendimento[]> {
    return this.atendimentoService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Atendimento> {
    return this.atendimentoService.findById(id);
  }

  @Get("/status")
  @HttpCode(HttpStatus.OK)
  findByStatus(@Param("status") status: string): Promise<Atendimento[]> {
    return this.atendimentoService.findByStatus(status);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() atendimento: Atendimento): Promise<Atendimento> {
    return this.atendimentoService.create(atendimento);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() atendimento: Atendimento): Promise<Atendimento> {
    return this.atendimentoService.update(atendimento);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  atualizarStatus(@Param('id') id: number) {
    return this.atendimentoService.atualizarStatus(id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult>{
    return this.atendimentoService.delete(id);
  }
}