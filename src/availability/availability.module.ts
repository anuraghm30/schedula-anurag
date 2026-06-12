import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

import { Doctor } from '../doctor/doctor.entity';
import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { Appointment } from '../appointment/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    Doctor,
    RecurringAvailability,
    CustomAvailability,
    Appointment,
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    JwtAuthGuard,
    RolesGuard,
    JwtService,
    Reflector,
  ],
})
export class AvailabilityModule {}