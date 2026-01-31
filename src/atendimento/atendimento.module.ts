import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atendimento } from './entities/atendimento.entity';
import { AtendimentoService } from './services/atendimento.service';
import { PacienteModule } from '../paciente/paciente.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AtendimentoController } from './controllers/atendimento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Atendimento]),
    PacienteModule,   
    UsuarioModule,  
  ],
  controllers: [AtendimentoController],
  providers: [AtendimentoService], 
})
export class AtendimentoModule {}
