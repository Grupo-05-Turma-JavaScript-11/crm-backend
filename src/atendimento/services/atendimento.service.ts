import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { DeleteResult } from "typeorm/browser";
import { PacienteService } from "../../paciente/services/paciente.service";
import { Atendimento } from "../entities/atendimento.entity";

@Injectable()
export class AtendimentoService {
  constructor(
    @InjectRepository(Atendimento)
    private atendimentoRepository: Repository<Atendimento>, 
    private pacienteService: PacienteService
  ) {}

  async findAll(): Promise<Atendimento[]> {
    return await this.atendimentoRepository.find({
      relations:{ 
        paciente: true,
        usuario: true
      }
    })
  }

  async findById(id: number): Promise<Atendimento> {
    const atendimento = await this.atendimentoRepository.findOne({
      where: { id },
      relations:{ 
        paciente: true,
        usuario: true
      }
    })

    if (!atendimento){
      throw new HttpException("Atendimento não encontrado!", HttpStatus.NOT_FOUND)
    }

    return atendimento
  }

  async findByPaciente(nome: string): Promise<Atendimento[]> {
    return await this.atendimentoRepository.find({
      where: { paciente: { nome: ILike(`%${nome}%`) } },
      relations:{ 
        paciente: true,
        usuario: true
      }
    })
  }

 async findByStatus(status: string): Promise<Atendimento[]> {
    return await this.atendimentoRepository.find({
      where:{ status: ILike(`%${status}%`) },
      relations:{ 
        paciente: true,
        usuario: true
      }
    })
  }

  async create(atendimento: Atendimento): Promise<Atendimento> {
    if (atendimento.paciente){
      const paciente = await this.pacienteService.findById(atendimento.paciente.id)

      if (!paciente){
        throw new HttpException('Paciente não encontrado!', HttpStatus.NOT_FOUND)
      }
    }
        return await this.atendimentoRepository.save(atendimento)
  }

  async update(atendimento: Atendimento): Promise<Atendimento> {
    const buscaAtendimento: Atendimento = await this.findById(atendimento.id)

    if (!buscaAtendimento || !atendimento.id) {
      throw new HttpException('Atendimento não encontrado!', HttpStatus.NOT_FOUND)
    }

    if (atendimento.paciente){
      const paciente = await this.pacienteService.findById(atendimento.paciente.id)
      if (!paciente){
        throw new HttpException('Paciente não encontrado!', HttpStatus.NOT_FOUND)
        }
    }
        return await this.atendimentoRepository.save(atendimento)
  }

  // Funcionalidade especial
  async atualizarStatus(id: number): Promise<Atendimento> {
    const atendimento = await this.findById(id);
  
    switch (atendimento.status) {
      case 'AGENDADO':
        atendimento.status = 'EM_TRATAMENTO';
        break;
  
      case 'EM_TRATAMENTO':
        atendimento.status = 'FINALIZADO';
        break;
  
      default:
        throw new Error('Status do atendimento não pode ser alterado');
    }
  
    return await this.atendimentoRepository.save(atendimento);
  }
  


  async delete(id: number): Promise<DeleteResult> {
    const buscaAtendimento = await this.findById(id)
    // Se o atendimento NÃO existir, mostre uma Exceção com o status: 404 Not Found
    if (!buscaAtendimento){
      throw new HttpException('Atendimento não encontrado!', HttpStatus.NOT_FOUND)
    }
    return await this.atendimentoRepository.delete(id)
  }

}
