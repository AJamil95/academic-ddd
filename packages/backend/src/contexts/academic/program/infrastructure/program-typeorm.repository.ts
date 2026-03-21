import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Program } from "../domain/program.entity";
import { FindPaginatedOptions, IProgramRepository, type ProgramSortField } from "../domain/program.repository";
import { ProgramTypeOrmEntity } from "./program-typeorm.entity";

const SORT_FIELD_MAP: Record<string, keyof ProgramTypeOrmEntity> = {
  name: 'name',
  code: 'code',
  credits_required: 'credits_required',
  department_id: 'department_id',
  createdAt: 'createdAt',
};

@Injectable()
export class ProgramTypeOrmRepository implements IProgramRepository {
  constructor(
    @InjectRepository(ProgramTypeOrmEntity)
    private readonly repository: Repository<ProgramTypeOrmEntity>,
  ) {}


  async findPaginated(options: {
  offset: number;
  limit: number;
  sortBy?: ProgramSortField;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ data: Program[]; total: number }> {
  // 1. Usamos findAndCount para obtener los datos y el total en una sola consulta
  const [entities, total] = await this.repository.findAndCount({
    skip: options.offset,
    take: options.limit,
    order: options.sortBy ? {
      [options.sortBy]: options.sortOrder?.toUpperCase() || 'ASC'
    } : { name: 'ASC' } // Orden por defecto
  });

  // 2. Mapeamos las entidades de BD a tu Entidad de Dominio si es necesario
    const programs = entities.map(entity => new Program(
      entity.id,
      entity.name,
      entity.code,
      entity.credits_required,
      entity.department_id
    ));

    return {
    data: programs,
    total: total
  };
  }

  async save(program: Program): Promise<Program> {
    const entity = this.repository.create(program);
    await this.repository.save(entity);
    return entity;
  }

  async findById(id: string): Promise<Program | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Program[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async create(program: Program): Promise<void> {
    const entity = this.repository.create(program);
    await this.repository.save(entity);
  }

  async update(program: Program): Promise<void> {
    await this.repository.save(program);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async enrollStudent(programId: string, studentId: string): Promise<void> {
    // Implementation for enrolling a student in a program
  }

  async count(): Promise<number> {
    return this.repository.count();
  }


  private toDomain(entity: ProgramTypeOrmEntity): Program {
    return new Program(
      entity.id,
      entity.name,
      entity.code,
      entity.credits_required,
      entity.department_id,
    );
  }


}
