export class Program {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public credits_required: number,
    public department_id: string,
  ) {}
}
