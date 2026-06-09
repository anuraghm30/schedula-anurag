import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Patient } from './patient.entity';
import { User } from '../users/entities/user.entity';

import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
    ]),
    AuthModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}