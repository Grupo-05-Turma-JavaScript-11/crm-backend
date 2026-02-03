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

  async findByUsuario(usuarioId: number): Promise<Atendimento[]> {
    return await this.atendimentoRepository.find({
        where: {
            usuario: { id: usuarioId } // Filtra pelo relacionamento
        },
        relations: { 
          paciente: true,
          usuario: true
        } // Opcional: traz os dados do paciente junto
    });
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
    // 1. Verifica se o ID foi fornecido
    if (!atendimento.id) {
      throw new HttpException('ID do atendimento é obrigatório!', HttpStatus.BAD_REQUEST);
    }
  
    // 2. Busca o registro existente no banco
    const buscaAtendimento = await this.findById(atendimento.id);
  
    if (!buscaAtendimento) {
      throw new HttpException('Atendimento não encontrado!', HttpStatus.NOT_FOUND);
    }
  
    // 3. Validação do Paciente (se houver alteração de paciente)
    if (atendimento.paciente && atendimento.paciente.id) {
      const paciente = await this.pacienteService.findById(atendimento.paciente.id);
      if (!paciente) {
        throw new HttpException('Paciente informado não existe!', HttpStatus.NOT_FOUND);
      }
    }
  
    // 4. Merge e Save
    // O preload ou o merge garantem que os campos não enviados mantenham os valores originais
    const atendimentoAtualizado = this.atendimentoRepository.merge(buscaAtendimento, atendimento);
    
    return await this.atendimentoRepository.save(atendimentoAtualizado);
  }

  // Funcionalidade especial
  async atualizarStatus(id: number): Promise<Atendimento> {
    const atendimento = await this.findById(id);
  
    switch (atendimento.status) {
      case 'AGENDADO':
        atendimento.status = 'EM TRATAMENTO';
        break;
  
      case 'EM TRATAMENTO':
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
