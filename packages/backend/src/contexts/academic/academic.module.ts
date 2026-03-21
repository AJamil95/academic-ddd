import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CourseModule } from './course/course.module';
import { ProgramModule } from './program/program.module';

@Module({
  imports: [StudentModule, ScheduleModule, CourseModule, ProgramModule],
  exports: [StudentModule, ScheduleModule, CourseModule, ProgramModule],
})
export class AcademicModule {}
