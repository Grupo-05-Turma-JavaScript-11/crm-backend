import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Atendimento } from "../../atendimento/entities/atendimento.entity"
import { ApiProperty } from "@nestjs/swagger"

@Entity({name: "tb_usuarios"})
export class Usuario {

    @PrimaryGeneratedColumn()
    @ApiProperty() 
    id: number

    @IsNotEmpty()
    @Column({length: 255, nullable: false}) 
    @ApiProperty() 
    nome: string

    @IsEmail()
    @IsNotEmpty()
    @Column({length: 255, nullable: false })
    @ApiProperty({example: "email@email.com.br"}) 
    email: string

    @Column({length: 5000 })
    @ApiProperty() 
    foto: string

    @MinLength(8)
    @IsNotEmpty()
    @Column({length: 255, nullable: false })
    @ApiProperty()
    senha: string

    @ApiProperty()
    @OneToMany(() => Atendimento, (atendimento) => atendimento.usuario)
    atendimento: Atendimento[]
}