import { Controller, Post, Get, Body } from '@nestjs/common';
import { AtendimentoService } from '../services/atendimento.service';


@Controller('atendimentos')
export class AtendimentoController {

  constructor(private readonly atendimentoService: AtendimentoService) {}

  @Post()
  create(@Body() body: any) {
    return this.atendimentoService.create(body);
  }

  @Get()
  findAll() {
    return this.atendimentoService.findAll();
  }
}