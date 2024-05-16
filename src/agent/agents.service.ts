import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createAgentDto: CreateAgentDto, createAccount: boolean, file: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let agent: Agent;
    try {
      const { createUserDto, ...AgentDto } = createAgentDto;

      agent = this.agentRepository.create(AgentDto);
      await this.agentRepository.save(agent);

      if (createAccount && createUserDto) {
        const user = await this.userService.createForAgent(createUserDto, agent, file);
        agent.user = user;
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status);
    } finally {
      await queryRunner.release();
    }
    return agent;
  }

  async createAccountForAgent(id: number, createUserDto: CreateUserDto, file: Express.Multer.File) {
    const agent = await this.agentRepository.findOne({ where: { id } });

    if (!agent) {
      throw new NotFoundException();
    }

    const user = await this.userService.createForAgent(createUserDto, agent, file);
    agent.user = user;
    return agent;
  }

  findAll() {
    return this.agentRepository
      .createQueryBuilder('agent')
      .leftJoinAndSelect('agent.user', 'user')
      .where((qb: SelectQueryBuilder<Agent>) => {
        qb.where('user.disabled = :disabled', { disabled: false }).orWhere('user.id IS NULL');
      })
      .andWhere('agent.disabled = :disabled', { disabled: false })
      .getMany();
  }

  findOne(id: number) {
    return this.agentRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateAgentDto: UpdateAgentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let agent: Agent;
    try {
      agent = await this.agentRepository.findOne({ where: { id } });
      if (!agent) {
        throw new NotFoundException();
      }

      this.agentRepository.merge(agent, updateAgentDto);
      await this.agentRepository.save(agent);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new HttpException(error.message, error.status);
    }
    await queryRunner.release();
    return agent;
  }

  async updateAgentStatus(id: number, disabled: boolean): Promise<Agent> {
    const agent = await this.findOne(id);

    if (!agent) {
      throw new NotFoundException('User not found');
    }

    agent.disabled = disabled;

    return await this.agentRepository.save(agent);
  }

  async remove(id: number) {
    const agent = await this.agentRepository.findOne({
      where: { id },
    });

    if (!agent) {
      throw new NotFoundException();
    }
    return this.agentRepository.delete(id);
  }
}
