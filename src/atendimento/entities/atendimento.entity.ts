import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medico } from '../../medico/entities/medico.entity';
//import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'tb_atendimento' })
export class Atendimento {

  @PrimaryGeneratedColumn()
  id: number;

  // Data do atendimento
  @Column({ type: 'date' })
  data: Date;

  // Status do atendimento (ABERTO, FINALIZADO, CANCELADO)
  @Column({ length: 255 })
  status: string;

  // Motivo do atendimento
  @Column({ length: 255 })
  motivo: string;

  // Valor estimado ou aprovado
  @Column()
  orcamento: number;

  // Observações gerais
  @Column({ length: 255 })
  observacao: string;

  // Relacionamento: um atendimento pode ter vários médicos
  //@OneToMany(() => Medico, medico => medico.atendimento)
  //medicos: Medico[];

  // Relacionamento: um atendimento pode ter vários usuários
  //@OneToMany(() => Usuario, usuario => usuario.atendimento)
  //usuarios: Usuario[];
}