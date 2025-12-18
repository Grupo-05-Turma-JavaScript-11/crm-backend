import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { MedicoController } from './controller/medico.controller';
import { MedicoService } from './services/medico.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  controllers: [MedicoController], 
  providers: [MedicoService],
  exports: [MedicoService],
})
export class MedicoModule {}