import { Injectable, Inject } from '@nestjs/common';
import { Program } from '../domain/program.entity';
import { IProgramRepository, PROGRAM_REPOSITORY, type ProgramSortField } from '../domain/program.repository';
import { RoleService } from '../../../identity-access/roles/application/role.service';
import { UserService } from '../../../identity-access/users/application/user.service';

export type ProgramsPaginatedResult = {
  data: Program[];
  total: number;
};

@Injectable()
export class ProgramService {
  constructor(
    @Inject(PROGRAM_REPOSITORY)
    private readonly programsRepository: IProgramRepository,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Program[]> {
    const programs = await this.programsRepository.findAll();
    return (programs || []);
  }

  async findById(id: string): Promise<Program | null> {
    return this.programsRepository.findById(id);
  }

  async findPaginated(
  page: number,
  pageSize: number,
  sortBy?: ProgramSortField,
  sortOrder?: 'asc' | 'desc',
): Promise<ProgramsPaginatedResult> {
  // Aseguramos que los valores sean numéricos y positivos
  const validatedPage = Math.max(1, page);
  const validatedPageSize = Math.max(1, pageSize);

  const offset = (validatedPage - 1) * validatedPageSize;
  const limit = validatedPageSize;

  // El repositorio devuelve [data, total]
  const result = await this.programsRepository.findPaginated({
    offset,
    limit,
    sortBy,
    sortOrder,
  });

  // Si el repo falla o devuelve null, aseguramos un array vacío para el frontend
  return {
    data: result?.data || null,
    total: result?.total || 0
  };
}


  async delete(id: string): Promise<void> {
    return this.programsRepository.delete(id);
  }

  async enrollStudent(programId: string, studentId: string): Promise<void> {
    return this.programsRepository.enrollStudent(programId, studentId);
  }

  async update(id: string, data: Partial<{
    name: string;
    code: string;
    credits_required: number;
    department_id: string;
  }>): Promise<Program> {
    const program = await this.programsRepository.findById(id);
    if (!program) {
      throw new Error('Program not found');
    }
    const updated = new Program(
      program.id,
      data.name ?? program.name,
      data.code ?? program.code,
      data.credits_required ?? program.credits_required,
      data.department_id ?? program.department_id,
    );
    await this.programsRepository.update(updated);
    return updated;
  }

  async create(data: {
    name: string;
    code: string;
    credits_required: number;
    department_id: string;
  }): Promise<Program> {
    const id = crypto.randomUUID();
    const program = new Program(
      id,
      data.name,
      data.code,
      data.credits_required,
      data.department_id,
    );
    return this.programsRepository.save(program);
  }
}
