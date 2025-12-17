import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atendimento } from '../entities/atendimento.entity';

@Injectable()
export class AtendimentoService {

  constructor(
    @InjectRepository(Atendimento)
    private atendimentoRepository: Repository<Atendimento>,
  ) {}

  create(atendimento: Partial<Atendimento>) {
    return this.atendimentoRepository.save(atendimento);
  }

  findAll() {
    return this.atendimentoRepository.find({
      relations: ['medicos', 'usuarios'],
    });
  }
}