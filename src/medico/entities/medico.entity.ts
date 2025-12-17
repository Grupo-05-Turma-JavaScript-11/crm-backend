import { IsNotEmpty, IsNumber} from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity({ name: "tb_medicos"  }) // Indicando que a classe é uma Entidade/Model
export class Medico {

    @PrimaryGeneratedColumn() // Chave Primária e Auto Incremental
    id: number

    @IsNotEmpty() // Validador de Objeto
    @Column({ length: 100, nullable: false  }) //Tamanho Máximo: 100 | Regra do MySQL - NOT NULL
    nome: string

    @IsNotEmpty() // Validador de Objeto
    @Column({ length: 15, nullable: false  }) //Tamanho Máximo: 15 | Regra do MySQL - NOT NULL
    CRM: string 

    @IsNotEmpty() // Validador de Objeto
    @IsNumber() // Validador de Número
    @Column({ nullable: false  }) //Tamanho Máximo: 15 | Regra do MySQL - NOT NULL
    telefone: number 

    @IsNotEmpty() // Validador de Objeto
    @Column({ length: 100, nullable: false  }) //Tamanho Máximo: 100 | Regra do MySQL - NOT NULL
    turno_trabalho: string
}