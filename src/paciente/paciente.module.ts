import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { PacienteController } from './controllers/paciente.controller';
import { PacienteService } from './services/paciente.service';
import Prontuario from '../prontuario/entities/prontuario.entity';
import { ProntuarioModule } from '../prontuario/prontuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, Prontuario]),
    forwardRef(() => ProntuarioModule), 
  ],
  controllers: [PacienteController],
  providers: [PacienteService], 
  exports: [PacienteService],
})
export class PacienteModule {}
