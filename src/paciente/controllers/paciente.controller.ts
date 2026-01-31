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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Paciente } from '../entities/paciente.entity';
import { DeleteResult } from 'typeorm';
import { PacienteService } from '../services/paciente.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Roles } from '../../usuario/decorator/roles.decorator';
import { UsuarioTipo } from '../../usuario/entities/usuario.entity';
import { RolesGuard } from '../../auth/guard/roles.guard';

@ApiTags('Pacientes')
@UseGuards(JwtAuthGuard)
@Controller('/pacientes')
@ApiBearerAuth()
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get() // Indica qual tipo de Requisição esse método é executado
  @HttpCode(HttpStatus.OK) // monta a Resposta HTTP para o Front com o status 200
  findAll(): Promise<Paciente[]> {
    return this.pacienteService.findAll();
  }

  @Get('/:id') // sai de id = "1" --> id = 1
  @HttpCode(HttpStatus.OK) // monta a Resposta HTTP para o Front com o status 200
  findById(@Param('id', ParseIntPipe) id: number): Promise<Paciente> {
    // @Param captura o paramêtro envia pelo endpoint e o atribui ao parametro do método findById(id:number)
    return this.pacienteService.findById(id);
  }

  @Get('/nome/:nome') // pacientes/nome/{texto}
  @HttpCode(HttpStatus.OK)
  findAllByName(@Param('nome') nome: string): Promise<Paciente[]> {
    return this.pacienteService.findAllByName(nome);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UsuarioTipo.ADMIN, UsuarioTipo.MEDICO) // Certifique-se que UsuarioTipo.MEDICO também possa se necessário
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() paciente: Paciente, @Req() req: any) {
    // O 'req.user' contém os dados do médico logado (vindo do seu JWT Strategy)
    const medicoId = req.user.id; 
    return this.pacienteService.create(paciente, medicoId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() paciente: Paciente): Promise<Paciente> {
    return this.pacienteService.update(paciente);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.pacienteService.delete(id);
  }
}
