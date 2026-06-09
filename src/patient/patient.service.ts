import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(
    dto: CreatePatientDto,
    userId: number,
  ) {
    const existingPatient =
      await this.patientRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

    if (existingPatient) {
      return {
        message: 'Patient profile already exists',
      };
    }

    const patient =
      this.patientRepository.create(dto);

    (patient as any).user = {
      id: userId,
    };

    await this.patientRepository.save(patient);

    return {
      message:
        'Patient profile created successfully',
      profile: patient,
    };
  }

  async findOneByUserId(
    userId: number,
  ) {
    const patient =
      await this.patientRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

    if (!patient) {
      return {
        message: 'Patient profile not found',
      };
    }

    return patient;
  }

  async update(
    dto: UpdatePatientDto,
    userId: number,
  ) {
    const patient =
      await this.patientRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

    if (!patient) {
      return {
        message: 'Patient profile not found',
      };
    }

    Object.assign(patient, dto);

    await this.patientRepository.save(patient);

    return {
      message:
        'Patient profile updated successfully',
      profile: patient,
    };
  }
}