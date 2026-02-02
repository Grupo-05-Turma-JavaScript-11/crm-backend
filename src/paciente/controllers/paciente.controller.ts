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
  UseGuards,
} from '@nestjs/common';
import { Paciente } from '../entities/paciente.entity';
import { DeleteResult } from 'typeorm';
import { PacienteService } from '../services/paciente.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';


@ApiTags('Pacientes')
@UseGuards(JwtAuthGuard)
@Controller('/pacientes')
@ApiBearerAuth('access-token')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @UseGuards(JwtAuthGuard)
  @Get() // Indica qual tipo de Requisição esse método é executado
  @HttpCode(HttpStatus.OK) // monta a Resposta HTTP para o Front com o status 200
  findAll(): Promise<Paciente[]> {
    return this.pacienteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id') // sai de id = "1" --> id = 1
  @HttpCode(HttpStatus.OK) // monta a Resposta HTTP para o Front com o status 200
  findById(@Param('id', ParseIntPipe) id: number): Promise<Paciente> {
    // @Param captura o paramêtro envia pelo endpoint e o atribui ao parametro do método findById(id:number)
    return this.pacienteService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/nome/:nome') // pacientes/nome/{texto}
  @HttpCode(HttpStatus.OK)
  findAllByName(@Param('nome') nome: string): Promise<Paciente[]> {
    return this.pacienteService.findAllByName(nome);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() paciente: Paciente) { // Removido o @Req() req
    // Passamos apenas o objeto 'paciente' que veio do Body
    return this.pacienteService.create(paciente);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() paciente: Paciente): Promise<Paciente> {
    return this.pacienteService.update(paciente);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.pacienteService.delete(id);
  }
}
