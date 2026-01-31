import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import Prontuario from '../entities/prontuario.entity';
import { Paciente } from '../../paciente/entities/paciente.entity';

@Injectable()
export class ProntuarioService {
  constructor(
    @InjectRepository(Prontuario)
    private prontuarioRepository: Repository<Prontuario>,
  ) {}

  async buscarPorNomePaciente(nome: string): Promise<Prontuario[]> {
    return await this.prontuarioRepository.find({
      where: {
        paciente: {
          nome: Like(`%${nome}%`),
        },
      },
      relations: {
        paciente: true,
      },
    });
  }

  async buscarPorPaciente(id: number): Promise<Prontuario | null> {
    return await this.prontuarioRepository.findOne({
      where: { paciente: { id: id } },
      relations: ['paciente'],
    });
  }

  async criarParaPaciente(paciente: Paciente): Promise<Prontuario> {
    const prontuario = this.prontuarioRepository.create({
      paciente,
      historicoClinico: '',
      observacoesGerais: '',
    });

    return await this.prontuarioRepository.save(prontuario);
  }

  async atualizar(id: number, dados: Partial<Prontuario>) {
    const prontuario = await this.buscarPorPaciente(id);

    if (!prontuario) {
      throw new NotFoundException('Prontuário não encontrado');
    }

    Object.assign(prontuario, dados);

    return await this.prontuarioRepository.save(prontuario);
  }
}
