import { Program } from './program.entity';

export const PROGRAM_REPOSITORY = Symbol('PROGRAM_REPOSITORY');

export type ProgramSortField = 'name' | 'code' | 'credits_required' | 'department_id' | 'createdAt';

export type FindPaginatedOptions = {
  offset: number;
  limit: number;
  sortBy?: ProgramSortField;
  sortOrder?: 'asc' | 'desc';
};

export interface IProgramRepository {
  save(program: Program): Promise<Program>;
  findById(id: string): Promise<Program | null>;
  findAll(): Promise<Program[]>;
  create(program: Program): Promise<void>;
  update(program: Program): Promise<void>;
  delete(id: string): Promise<void>;
  enrollStudent(programId: string, studentId: string): Promise<void>;
  count(): Promise<number>;
  findPaginated(options: FindPaginatedOptions): Promise<{ data: Program[]; total: number }>;
}
