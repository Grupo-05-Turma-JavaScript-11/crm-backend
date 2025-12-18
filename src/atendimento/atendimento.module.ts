import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atendimento } from './entities/atendimento.entity';
import { AtendimentoController } from './controller/atendimento.controller';
import { AtendimentoService } from './services/atendimento.service';
import { MedicoModule } from '../medico/medico.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Atendimento]),
    MedicoModule,   
    UsuarioModule,  
  ],
  controllers: [AtendimentoController],
  providers: [AtendimentoService], 
})
export class AtendimentoModule {}
