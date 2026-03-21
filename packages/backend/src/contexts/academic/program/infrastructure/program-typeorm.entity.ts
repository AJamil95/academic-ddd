import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('programs')
export class ProgramTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('varchar', { name: 'code' })
  code: string;

  @Column('int', { name: 'credits_required' })
  credits_required: number;

  @Column('varchar', { name: 'department_id' })
  department_id: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
