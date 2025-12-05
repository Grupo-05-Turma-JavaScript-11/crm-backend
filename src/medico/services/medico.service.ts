import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Medico } from "../entities/medico.entity";


@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(Medico)
        private medicoRepository: Repository<Medico>,
        
    ) { }

    async findAll(): Promise<Medico[]> {
        return await this.medicoRepository.find();
    }

    async findById(id: number): Promise<Medico> {

        let medico = await this.medicoRepository.findOne({where: {id}});

        if (!medico)
            throw new HttpException('Medico não encontrado!', HttpStatus.NOT_FOUND);

        return medico;
    }

    async findByName(nome: string): Promise<Medico[]> {
        return await this.medicoRepository.find({
            where:{
                nome: ILike(`%${nome}%`)
            }
        })
    }
}