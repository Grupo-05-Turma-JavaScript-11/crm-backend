import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atendimento } from './entities/atendimento.entity';
import { AtendimentoController } from './controller/atendimento.controller';
import { AtendimentoService } from './services/atendimento.service';

@Module({
  imports: [TypeOrmModule.forFeature([Atendimento])],
  controllers: [AtendimentoController],
  providers: [AtendimentoService],
  exports: [TypeOrmModule],
})
export class AtendimentoModule {}
