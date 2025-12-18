import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Medico } from "../entities/medico.entity";
import { DeleteResult } from "typeorm/browser";


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

    async findAllByName(nome: string): Promise<Medico[]> {
        return await this.medicoRepository.find({
            where:{
                nome: ILike(`%${nome}%`)
            }
        })
    }

    async create(medico: Medico): Promise<Medico> {

        return await this.medicoRepository.save(medico);
    }

    async update(medico: Medico): Promise<Medico> {
        // Chama o método findById anteriro para pesquisar um atendimento pelo id extraido do objeto atendimento
        let buscaMedico = await this.findById(medico.id);

        // Se o atendimento não existir, lace uma Exceção que vai direto para o Cliente com o status 404 Not Found
        if (!buscaMedico || !medico.id) {
            throw new HttpException('Médico não encontrado!', HttpStatus.NOT_FOUND);
        }

        // Se o atendimento foi encontrado, cadastra ela no BD e retorna ela
        return await this.medicoRepository.save(medico);
    }

    async delete(id: number): Promise<DeleteResult> {
        
        let buscaMedico = await this.findById(id);
        
        if(!buscaMedico){
            throw new HttpException("Médico não encontrado!", HttpStatus.NOT_FOUND);
        }   
        
        return await this.medicoRepository.delete(id);
    }
}