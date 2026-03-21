import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseModule } from "../course/course.module";
import { IdentityAccessModule } from "../../identity-access/identity-access.module";
import { ProgramService } from "./application/program.service";
import { PROGRAM_REPOSITORY } from "./domain/program.repository";
import { ProgramTypeOrmEntity } from "./infrastructure/program-typeorm.entity";
import { ProgramTypeOrmRepository } from "./infrastructure/program-typeorm.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramTypeOrmEntity]),
    CourseModule,
    IdentityAccessModule,
  ],
  providers: [
    ProgramService,
    {
      provide: PROGRAM_REPOSITORY,
      useClass: ProgramTypeOrmRepository,
    },
  ],
  exports: [ProgramService],
})
export class ProgramModule {}
