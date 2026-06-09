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

  async create(dto: CreatePatientDto) {
    const existingPatient = await this.patientRepository.findOne({
      where: {},
    });

    if (existingPatient) {
      return {
        message: 'Patient profile already exists',
      };
    }

    const patient = this.patientRepository.create(dto);

    await this.patientRepository.save(patient);

    return {
      message: 'Patient profile created successfully',
      profile: patient,
    };
  }

  async findAll() {
    const patients = await this.patientRepository.find();

    if (patients.length === 0) {
      return {
        message: 'Patient profile not found',
      };
    }

    return patients;
  }

  async update(dto: UpdatePatientDto) {
    const patient = await this.patientRepository.findOne({
      where: {},
    });

    if (!patient) {
      return {
        message: 'Patient profile not found',
      };
    }

    Object.assign(patient, dto);

    await this.patientRepository.save(patient);

    return {
      message: 'Patient profile updated successfully',
      profile: patient,
    };
  }
}