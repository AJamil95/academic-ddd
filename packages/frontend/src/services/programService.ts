import { apiRequest } from "../lib";
import type { Program, CreateProgramDto, UpdateProgramDto } from "../entities";

export type { Program, CreateProgramDto, UpdateProgramDto } from "../entities";

export type ProgramsPaginatedParams = {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type ProgramsPaginatedResponse = {
  data: Program[];
  total: number;
};

export async function getProgramsPaginated(
  params: ProgramsPaginatedParams,
): Promise<ProgramsPaginatedResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  return apiRequest<ProgramsPaginatedResponse>(`/programs?${search.toString()}`, {
    defaultErrorMessage: "Error al cargar programas",
  });
}

export async function createProgram(data: CreateProgramDto): Promise<Program> {
  return apiRequest<Program>("/programs", {
    method: "POST",
    body: JSON.stringify(data),
    defaultErrorMessage: "Error al crear programa",
  });
}

export async function getPrograms(): Promise<Program[]> {
  return apiRequest<Program[]>("/programs", {
    defaultErrorMessage: "Error al cargar programas",
  });
}

export async function getProgram(id: string): Promise<Program> {
  try {
    return await apiRequest<Program>(`/programs/${id}`, {
      defaultErrorMessage: "Programa no encontrado",
    });
  } catch (err) {
    if (err instanceof Error && /not found|no encontrado/i.test(err.message))
      throw new Error("Programa no encontrado");
    throw err;
  }
}

export async function updateProgram(
  id: string,
  data: UpdateProgramDto,
): Promise<Program> {
  return apiRequest<Program>(`/programs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    defaultErrorMessage: "Error al actualizar programa",
  });
}

export async function deleteProgram(id: string): Promise<void> {
  return apiRequest(`/programs/${id}`, {
    method: "DELETE",
    defaultErrorMessage: "Error al eliminar programa",
  });
}

export async function enrollInProgram(params: { programId: string; userId: string }): Promise<void> {
  return apiRequest(`/programs/${params.programId}/enroll`, {
    method: "POST",
    body: JSON.stringify({ userId: params.userId }),
    defaultErrorMessage: "Error al inscribir en el programa",
  });
}
