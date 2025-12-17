import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Medico } from '../../medico/entities/medico.entity';
import { IsNotEmpty } from 'class-validator';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: 'tb_atendimento' })
export class Atendimento {

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Data do atendimento
  @IsNotEmpty()
  @Column({ type: 'date' })
  @ApiProperty()
  data: Date;

  // Status do atendimento (ABERTO, FINALIZADO, CANCELADO)
  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  status: string;

  // Motivo do atendimento
  @IsNotEmpty()
  @Column({ length: 255 })
  @ApiProperty()
  motivo: string;

  // Valor estimado ou aprovado
  @Column()
  @ApiProperty()
  valor: number;

  // Observações gerais
  @Column({ length: 255 })
  @ApiProperty()
  observacao: string;

  // Relacionamento: um médico pode ter vários atendimentos
  @ApiProperty({ type: () => Medico })
  @ManyToOne(() => Medico, (medico) => medico.atendimento)
  medico: Medico

  // Relacionamento: // um usuario pode ter vários atendimento
  @ApiProperty({ type: () => Usuario })
  @ManyToOne(() => Usuario, usuario => usuario.atendimento)
  usuario: Usuario
}