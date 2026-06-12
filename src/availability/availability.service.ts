import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(RecurringAvailability)
    private recurringRepository: Repository<RecurringAvailability>,

    @InjectRepository(CustomAvailability)
    private customRepository: Repository<CustomAvailability>,
  ) {}

  async createRecurringAvailability(
    dto: CreateRecurringAvailabilityDto,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: {
        id: dto.doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const availability = this.recurringRepository.create({
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      doctor,
    });

    return this.recurringRepository.save(availability);
  }

  async getDoctorAvailability(doctorId: number) {
    return this.recurringRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: ['doctor'],
    });
  }

  async deleteAvailability(id: number) {
    const availability = await this.recurringRepository.findOne({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    await this.recurringRepository.remove(availability);

    return {
      message: 'Availability deleted successfully',
    };
  }

  async createCustomAvailability(
    dto: CreateCustomAvailabilityDto,
  ) {
    const doctor = await this.doctorRepository.findOne({
      where: {
        id: dto.doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const availability = this.customRepository.create({
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      doctor,
    });

    return this.customRepository.save(availability);
  }

  async getCustomAvailability(doctorId: number) {
    return this.customRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: ['doctor'],
    });
  }
}