import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
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

    // Invalid time range validation
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'End time must be greater than start time',
      );
    }

    // Duplicate validation
    const duplicate =
      await this.recurringRepository.findOne({
        where: {
          doctor: { id: dto.doctorId },
          dayOfWeek: dto.dayOfWeek,
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      });

    if (duplicate) {
      throw new BadRequestException(
        'Availability already exists',
      );
    }

    // Overlap validation
    const existingSlots =
      await this.recurringRepository.find({
        where: {
          doctor: { id: dto.doctorId },
          dayOfWeek: dto.dayOfWeek,
        },
      });

    for (const slot of existingSlots) {
      const overlap =
        dto.startTime < slot.endTime &&
        dto.endTime > slot.startTime;

      if (overlap) {
        throw new BadRequestException(
          'Overlapping availability slot',
        );
      }
    }

    const availability =
      this.recurringRepository.create({
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        doctor,
      });

    return this.recurringRepository.save(
      availability,
    );
  }

  async getDoctorAvailability(
    doctorId: number,
  ) {
    return this.recurringRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: ['doctor'],
    });
  }

  async updateAvailability(
  id: number,
  dto: CreateRecurringAvailabilityDto,
) {
  const availability =
    await this.recurringRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

  if (!availability) {
    throw new NotFoundException(
      'Availability not found',
    );
  }

  if (dto.startTime >= dto.endTime) {
    throw new BadRequestException(
      'End time must be greater than start time',
    );
  }

  const existingSlots =
    await this.recurringRepository.find({
      where: {
        doctor: {
          id: availability.doctor.id,
        },
        dayOfWeek: dto.dayOfWeek,
      },
    });

  for (const slot of existingSlots) {
    if (slot.id === id) {
      continue;
    }

    const overlap =
      dto.startTime < slot.endTime &&
      dto.endTime > slot.startTime;

    if (overlap) {
      throw new ConflictException(
        'Overlapping availability slot',
      );
    }
  }

  availability.dayOfWeek = dto.dayOfWeek;
  availability.startTime = dto.startTime;
  availability.endTime = dto.endTime;

  return this.recurringRepository.save(
    availability,
  );
}

  async deleteAvailability(id: number) {
    const availability =
      await this.recurringRepository.findOne({
        where: { id },
      });

    if (!availability) {
      throw new NotFoundException(
        'Availability not found',
      );
    }

    await this.recurringRepository.remove(
      availability,
    );

    return {
      message:
        'Availability deleted successfully',
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

    // Invalid time range
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'End time must be greater than start time',
      );
    }

    // Duplicate validation
    const duplicate =
      await this.customRepository.findOne({
        where: {
          doctor: { id: dto.doctorId },
          date: dto.date,
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      });

    if (duplicate) {
      throw new BadRequestException(
        'Custom availability already exists',
      );
    }

    // Overlap validation
    const existingSlots =
      await this.customRepository.find({
        where: {
          doctor: { id: dto.doctorId },
          date: dto.date,
        },
      });

    for (const slot of existingSlots) {
      const overlap =
        dto.startTime < slot.endTime &&
        dto.endTime > slot.startTime;

      if (overlap) {
        throw new BadRequestException(
          'Overlapping custom availability slot',
        );
      }
    }

    const availability =
      this.customRepository.create({
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        doctor,
      });

    return this.customRepository.save(
      availability,
    );
  }

  async getCustomAvailability(
    doctorId: number,
  ) {
    return this.customRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: ['doctor'],
    });
  }

  async getAvailabilityByDate(
  doctorId: number,
  date: string,
) {
  const doctor =
    await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

  if (!doctor) {
    throw new NotFoundException(
      'Doctor not found',
    );
  }

  return this.customRepository.find({
    where: {
      doctor: {
        id: doctorId,
      },
      date,
    },
    relations: ['doctor'],
  });
}

  async deleteCustomAvailability(
    id: number,
  ) {
    const availability =
      await this.customRepository.findOne({
        where: { id },
      });

    if (!availability) {
      throw new NotFoundException(
        'Custom availability not found',
      );
    }

    await this.customRepository.remove(
      availability,
    );

    return {
      message:
        'Custom availability deleted successfully',
    };
  }
}