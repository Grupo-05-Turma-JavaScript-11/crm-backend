import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Atendimento } from '../../atendimento/entities/atendimento.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuario/entities/usuario.entity';
import Prontuario from '../../prontuario/entities/prontuario.entity';

@Entity({ name: 'tb_pacientes' })
export class Paciente {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Identificação
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @ApiProperty({ example: '1998-05-21' })
  @IsNotEmpty()
  @Column({ type: 'date', nullable: false })
  dataNascimento: Date;

  @ApiProperty({ example: 'M | F | O' })
  @IsNotEmpty()
  @Column({ length: 1, nullable: false })
  sexo: string;

  @ApiProperty({ example: '12345678900' })
  @IsNotEmpty()
  @Column({ length: 14, nullable: false, unique: true })
  documento: string;

  @ApiProperty()
  @Column({ length: 5000, nullable: true })
  foto?: string;

  // Contato
  @ApiProperty()
  @Column({ length: 100, nullable: true })
  email?: string;

  @ApiProperty()
  @Column({ length: 20, nullable: true })
  telefone?: string;

  // Administrativo
  @ApiProperty({ example: 'ATIVO | INATIVO' })
  @Column({ length: 10, default: 'ATIVO' })
  status: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: false })
  convenio: boolean;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  // Relacionamentos

  // Médico responsável (usuário)
  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, (usuario) => usuario.pacientes)
  usuario: Usuario;

  // Atendimentos do paciente
  @ApiProperty({ type: () => Atendimento })
  @OneToMany(() => Atendimento, (atendimento) => atendimento.paciente)
  atendimentos: Atendimento[];

  @OneToOne(() => Prontuario, (prontuario) => prontuario.paciente)
  prontuario: Prontuario;
}
