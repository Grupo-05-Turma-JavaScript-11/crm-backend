import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Paciente } from '../../paciente/entities/paciente.entity';

@Entity({ name: 'tb_prontuarios' })
export class Prontuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Relacionamento

  // Um prontuário pertence a um único paciente
  @ApiProperty({ type: () => Paciente })
  @OneToOne(() => Paciente)
  @JoinColumn()
  paciente: Paciente;

  // Informações clínicas consolidadas

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: 'Hipertensão, diabetes tipo 2' })
  historicoClinico?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: 'Dipirona' })
  alergias?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: 'Losartana 50mg' })
  medicamentosUsoContinuo?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: 'Cirurgia em 2019' })
  antecedentes?: string;

  // Observações gerais

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  observacoesGerais?: string;
}

export default Prontuario;
