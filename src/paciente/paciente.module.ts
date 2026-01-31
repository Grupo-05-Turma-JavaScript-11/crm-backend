import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { PacienteController } from './controllers/paciente.controller';
import { PacienteService } from './services/paciente.service';
import Prontuario from '../prontuario/entities/prontuario.entity';
import { ProntuarioService } from '../prontuario/services/prontuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Prontuario])],
  controllers: [PacienteController],
  providers: [PacienteService, ProntuarioService],
  exports: [PacienteService],
})
export class PacienteModule {}
