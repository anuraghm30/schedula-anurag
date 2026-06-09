import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(
    dto: CreateDoctorDto,
    userId: number,
  ) {
    const existingDoctor =
      await this.doctorRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

    if (existingDoctor) {
      return {
        message: 'Doctor profile already exists',
      };
    }

    const doctor =
      this.doctorRepository.create(dto);

    (doctor as any).user = {
      id: userId,
    };

    await this.doctorRepository.save(doctor);

    return {
      message:
        'Doctor profile created successfully',
      profile: doctor,
    };
  }

  async findOneByUserId(
    userId: number,
  ) {
    const doctor =
      await this.doctorRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

    if (!doctor) {
      return {
        message: 'Doctor profile not found',
      };
    }

    return doctor;
  }

  async update(
    dto: UpdateDoctorDto,
    userId: number,
  ) {
    const doctor =
      await this.doctorRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

    if (!doctor) {
      return {
        message: 'Doctor profile not found',
      };
    }

    Object.assign(doctor, dto);

    await this.doctorRepository.save(doctor);

    return {
      message:
        'Doctor profile updated successfully',
      profile: doctor,
    };
  }
}