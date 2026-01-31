import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';
import { DeleteResult } from 'typeorm/browser';
import Prontuario from '../../prontuario/entities/prontuario.entity';
import { ProntuarioService } from '../../prontuario/services/prontuario.service';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
    @InjectRepository(Prontuario)
    private prontuarioRepository: Repository<Prontuario>,
    private prontuarioService: ProntuarioService
  ) {}

  async findAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find();
  }

  async findById(id: number): Promise<Paciente> {
    let paciente = await this.pacienteRepository.findOne({ where: { id } });

    if (!paciente)
      throw new HttpException('Paciente não encontrado!', HttpStatus.NOT_FOUND);

    return paciente;
  }

  async findAllByName(nome: string): Promise<Paciente[]> {
    return await this.pacienteRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
    });
  }

  async obterProntuarioPorPaciente(id: number) {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['prontuario'],
    });

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Se ainda não tiver prontuário, cria automaticamente
    if (!paciente.prontuario) {
      const novoProntuario = this.prontuarioRepository.create({
        paciente,
      });

      paciente.prontuario =
        await this.prontuarioRepository.save(novoProntuario);
    }

    return paciente.prontuario;
  }

  async create(dados: any, medicoId: number) {
    // Criamos a instância unindo os dados do corpo com o ID do médico
    const novoRegistro = this.pacienteRepository.create({
      ...dados,
      medico: { id: medicoId } // Isso cria o vínculo na coluna de relacionamento
    });
  
    return await this.pacienteRepository.save(novoRegistro);
  }

  async update(paciente: Paciente): Promise<Paciente> {
    // Chama o método findById anteriro para pesquisar um atendimento pelo id extraido do objeto atendimento
    let buscaPaciente = await this.findById(paciente.id);

    // Se o atendimento não existir, lace uma Exceção que vai direto para o Cliente com o status 404 Not Found
    if (!buscaPaciente || !paciente.id) {
      throw new HttpException('Paciente não encontrado!', HttpStatus.NOT_FOUND);
    }

    // Se o atendimento foi encontrado, cadastra ela no BD e retorna ela
    return await this.pacienteRepository.save(paciente);
  }

  async delete(id: number): Promise<DeleteResult> {
    let buscaPaciente = await this.findById(id);

    if (!buscaPaciente) {
      throw new HttpException('Paciente não encontrado!', HttpStatus.NOT_FOUND);
    }

    return await this.pacienteRepository.delete(id);
  }
}
