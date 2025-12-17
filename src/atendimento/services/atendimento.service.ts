import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { DeleteResult } from "typeorm/browser";
import { MedicoService } from "../../medico/services/medico.service";
import { Atendimento } from "../entities/atendimento.entity";

@Injectable()
export class AtendimentoService {
  constructor(
    @InjectRepository(Atendimento)
    private atendimentoRepository: Repository<Atendimento>, 
    private medicoService: MedicoService
  ) {}

  async findAll(): Promise<Atendimento[]> {
    return await this.atendimentoRepository.find({
      relations:{ 
        medico: true,
        usuario: true
      }
    })
  }

  async findById(id: number): Promise<Atendimento> {
    const atendimento = await this.atendimentoRepository.findOne({
      where: { id },
      relations:{ 
        medico: true,
        usuario: true
      }
    })

    if (!atendimento){
      throw new HttpException("Atendimento não encontrado!", HttpStatus.NOT_FOUND)
    }

    return atendimento
  }

 async findByStatus(status: string): Promise<Atendimento[]> {
    return await this.atendimentoRepository.find({
      where:{ status: ILike(`%${status}%`) },
      relations:{ 
        medico: true,
        usuario: true
      }
    })
  }

  async create(atendimento: Atendimento): Promise<Atendimento> {
    if (atendimento.medico){
      const medico = await this.medicoService.findById(atendimento.medico.id)

      if (!medico){
        throw new HttpException('Medico não encontrada!', HttpStatus.NOT_FOUND)
      }
    }
        return await this.atendimentoRepository.save(atendimento)
  }

  async update(atendimento: Atendimento): Promise<Atendimento> {
    const buscaAtendimento: Atendimento = await this.findById(atendimento.id)

    if (!buscaAtendimento || !atendimento.id) {
      throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND)
    }

    if (atendimento.medico){
      const medico = await this.medicoService.findById(atendimento.medico.id)
      if (!medico){
        throw new HttpException('Medico não encontrada!', HttpStatus.NOT_FOUND)
        }
    }
        return await this.atendimentoRepository.save(atendimento)
  }

  async atualizarStatus(id: number): Promise<Atendimento> {
    const atendimento = await this.findById(id)

    if (atendimento.status === 'ABERTO') {
      atendimento.status = 'FINALIZADO'
    }

    return await this.atendimentoRepository.save(atendimento)
  }


  async delete(id: number): Promise<DeleteResult> {
    const buscaAtendimento = await this.findById(id)
    // Se a postagem NÃO existir, mostre uma Exceção com o status: 404 Not Found
    if (!buscaAtendimento){
      throw new HttpException('Atendimento não encontrado!', HttpStatus.NOT_FOUND)
    }
    return await this.atendimentoRepository.delete(id)
  }

  //função especial
}
