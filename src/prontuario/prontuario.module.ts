import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prontuario } from "./entities/prontuario.entity";
import { ProntuarioService } from "./services/prontuario.service";
import { ProntuarioController } from "./controllers/prontuario.controller";
import { PacienteModule } from "../paciente/paciente.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Prontuario]),
    PacienteModule
  ],
  controllers: [ProntuarioController],
  providers: [ProntuarioService],
  exports: [ProntuarioService]
})
export class ProntuarioModule {}
