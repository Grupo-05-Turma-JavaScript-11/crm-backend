import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../paciente/entities/paciente.entity';
import { IsNotEmpty } from 'class-validator';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: "tb_atendimentos" })
export class Atendimento {

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Datas
  @IsNotEmpty()
  @Column({ type: "timestamp" })
  @ApiProperty({ example: "2026-02-01T14:30:00" })
  dataHora: Date;

  // Status
  @IsNotEmpty()
  @Column({ length: 20, default: "AGENDADO" })
  @ApiProperty({ example: "AGENDADO | EM TRATAMENTO | FINALIZADO | CANCELADO" })
  status: string;

  // Informações clínicas do evento
  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty({ example: "Consulta de rotina" })
  motivo: string;

  @Column({ type: "text", nullable: true })
  @ApiProperty()
  observacao?: string;

  // Financeiro
  @Column({ length: 20, nullable: false })
  @ApiProperty({ example: "PARTICULAR | CONVENIO" })
  formaPagamento: string;

  // Relacionamentos

  @ApiProperty({ type: () => Paciente })
  @ManyToOne(() => Paciente, paciente => paciente.atendimentos)
  paciente: Paciente;

  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, usuario => usuario.atendimentos)
  usuario: Usuario;
}
