import { IsNotEmpty, IsNumber} from "class-validator"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Atendimento } from "../../atendimento/entities/atendimento.entity"
import { ApiProperty } from "@nestjs/swagger"


@Entity({ name: "tb_medicos"  }) // Indicando que a classe é uma Entidade/Model
export class Medico {

    @PrimaryGeneratedColumn() // Chave Primária e Auto Incremental
    @ApiProperty()
    id: number

    @ApiProperty()
    @IsNotEmpty() // Validador de Objeto
    @Column({ length: 100, nullable: false  }) //Tamanho Máximo: 100 | Regra do MySQL - NOT NULL
    nome: string

    @ApiProperty()
    @IsNotEmpty() // Validador de Objeto
    @Column({ length: 15, nullable: false  }) //Tamanho Máximo: 15 | Regra do MySQL - NOT NULL
    CRM: string 

    @ApiProperty()
    @IsNotEmpty() // Validador de Objeto
    @IsNumber() // Validador de Número
    @Column({ nullable: false  }) //Tamanho Máximo: 15 | Regra do MySQL - NOT NULL
    telefone: number 

    @ApiProperty()
    @IsNotEmpty() // Validador de Objeto
    @Column({ length: 100, nullable: false  }) //Tamanho Máximo: 100 | Regra do MySQL - NOT NULL
    turno_trabalho: string

    @ApiProperty()
    @OneToMany(() => Atendimento, (atendimento) => atendimento.medico)
    atendimento: Atendimento[]
}