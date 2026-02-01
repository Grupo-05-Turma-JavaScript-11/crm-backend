import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Atendimento } from "../../atendimento/entities/atendimento.entity"
import { ApiProperty } from "@nestjs/swagger"
import { Paciente } from "../../paciente/entities/paciente.entity"

export enum UsuarioTipo {
  ADMIN = 'ADMIN',
  MEDICO = 'MEDICO',
  ASSISTENTE = 'ASSISTENTE',
}

@Entity({ name: "tb_usuarios" })
export class Usuario {

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // Identificação
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 255, nullable: false, unique: true })
  @ApiProperty({ example: "email@email.com.br" })
  email: string;

  // Autenticação
  @MinLength(8)
  @IsNotEmpty()
  @Column({ length: 255, nullable: false, select: false })
  @ApiProperty()
  senha: string;

  // Registro profissional
  @Column({ length: 20, unique: false, nullable: true })
  @ApiProperty({ example: "CRM-SP 123456" })
  crm?: string;

  @Column({ length: 5000, nullable: true })
  @ApiProperty()
  foto?: string;

  // Relacionamentos ------

  // Médico possui vários atendimentos
  @ApiProperty({ type: () => Atendimento })
  @OneToMany(() => Atendimento, atendimento => atendimento.usuario)
  atendimentos?: Atendimento[];

  // Médico possui vários pacientes
  @ApiProperty({ type: () => Paciente })
  @OneToMany(() => Paciente, paciente => paciente.usuario)
  pacientes?: Paciente[];

  // Permissões ----
  @IsNotEmpty()
  @Column({   type: "varchar", length: 20,  nullable: false,  default: UsuarioTipo.MEDICO })
  @ApiProperty({ enum: UsuarioTipo, example: UsuarioTipo.MEDICO + " | " + UsuarioTipo.ASSISTENTE})
  tipo: UsuarioTipo;

}
