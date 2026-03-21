import {  Controller, Get, Post, Body, Patch, Param, Query, Delete, NotFoundException } from '@nestjs/common';
import { ProgramService } from '../../../contexts/academic/program/application/program.service';
import type { ProgramSortField } from '../../../contexts/academic/program/domain/program.repository';

const SORT_FIELDS: ProgramSortField[] = ['name', 'code', 'credits_required', 'createdAt'];

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramService) {}

  @Post()
  create(@Body() body: { name: string; code: string; credits_required: number; department_id: string }) {
    return this.programsService.create(body);
  }

  @Get()
  async findAll(
  @Query('page') pageStr?: string,
  @Query('pageSize') pageSizeStr?: string,
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: string,
) {
  const page = pageStr != null ? parseInt(pageStr, 10) : 1; // Default a 1
  const pageSize = pageSizeStr != null ? parseInt(pageSizeStr, 10) : 10; // Default a 10

  const sort = sortBy && SORT_FIELDS.includes(sortBy as ProgramSortField)
    ? (sortBy as ProgramSortField)
    : 'name'; // Evitamos enviar 'createdAt' si no existe en la DB

  const order = sortOrder === 'desc' || sortOrder === 'asc' ? sortOrder : 'asc';

  // CORRECCIÓN: Pasar los argumentos individualmente como los espera el servicio
  return this.programsService.findPaginated(
    page,
    pageSize,
    sort,
    order
  );
}

  @Get(':id')
  async findById(@Param('id') id: string) {
    const program = await this.programsService.findById(id);
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProgramDto: any) {
    const program = await this.programsService.update(id, updateProgramDto);
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.programsService.delete(id);
  }
}
